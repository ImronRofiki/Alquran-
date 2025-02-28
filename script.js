document.addEventListener("DOMContentLoaded", function () {
    const juzContainer = document.getElementById("juzContainer");

    for (let i = 1; i <= 30; i++) {
        const juzBox = document.createElement("div");
        juzBox.classList.add("juz-box");
        juzBox.innerHTML = `
            <h2>Juz ${i}</h2>
            <a href="juz.html?juz=${i}" class="btn">Baca</a>
        `;
        juzContainer.appendChild(juzBox);
    }
});
