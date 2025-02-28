document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const juzNumber = params.get("juz") || 1;

    document.getElementById("juzTitle").innerText = `Juz ${juzNumber}`;
    const quranContainer = document.getElementById("quranContainer");

    // Ambil teks Alquran
    fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/quran-uthmani`)
        .then(response => response.json())
        .then(quranData => {
            fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/id.indonesian`)
                .then(response => response.json())
                .then(translateData => {
                    let lastSurah = null;

                    quranData.data.ayahs.forEach((ayah, index) => {
                        const ayahContainer = document.createElement("div");
                        ayahContainer.classList.add("ayah-box");

                        // Jika ini ayat pertama dari surah baru (kecuali Al-Fatihah)
                        if (ayah.numberInSurah === 1 && ayah.surah.number !== 1) {
                            // Tambahkan kotak Bismillah di atas
                            if (lastSurah !== ayah.surah.number) {
                                const bismillahBox = document.createElement("div");
                                bismillahBox.classList.add("bismillah-box");
                                bismillahBox.innerText = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
                                quranContainer.appendChild(bismillahBox);
                                lastSurah = ayah.surah.number;
                            }

                            // Hapus Bismillah dari ayat pertama jika ada
                            ayah.text = ayah.text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ */, "");
                        }

                        const ayahText = document.createElement("p");
                        ayahText.innerHTML = `${ayah.text} <strong>(${ayah.surah.number}:${ayah.numberInSurah})</strong>`;

                        const translationText = document.createElement("p");
                        translationText.classList.add("translation");
                        translationText.innerText = translateData.data.ayahs[index].text;

                        // Tambahkan tombol audio
                        const audioBtn = document.createElement("button");
                        audioBtn.innerText = "🔊 Dengar";
                        audioBtn.classList.add("audio-btn");
                        audioBtn.onclick = function () {
                            playAyahAudio(ayah.number);
                        };

                        // Elemen audio
                        const audioElement = document.createElement("audio");
                        audioElement.id = `audio-${ayah.number}`;
                        audioElement.controls = true;

                        ayahContainer.appendChild(ayahText);
                        ayahContainer.appendChild(translationText);
                        ayahContainer.appendChild(audioBtn);
                        ayahContainer.appendChild(audioElement);

                        quranContainer.appendChild(ayahContainer);
                    });
                })
                .catch(error => console.error("Error fetching translation:", error));
        })
        .catch(error => console.error("Error fetching Quran data:", error));

    function playAyahAudio(ayahNumber) {
        fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/ar.alafasy`)
            .then(response => response.json())
            .then(data => {
                if (data && data.data && data.data.audio) {
                    const audioEl = document.getElementById(`audio-${ayahNumber}`);
                    audioEl.src = data.data.audio; // Set sumber audio
                    audioEl.play();
                } else {
                    console.error("Audio tidak ditemukan untuk ayat ini.");
                }
            })
            .catch(error => console.error("Error mengambil audio:", error));
    }
});
