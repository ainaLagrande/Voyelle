// Graphic animation
let rid = null;

const spring = 0.010;
const friction = 0.8;
const overlap = 0.50; // La suivante démarre à 50 %

const divs = Array.from(document.querySelectorAll(".innerdiv"));

class Chart {
  constructor(path, text, target) {
    this.path = path;
    this.text = text;
    this.text.textContent = target + "%";

    this.R = 10;
    this.start = 0.01;
    this.divisions = 100;
    this.vel = 0;
    this.active = false;
    this.started = false;
    this.targetValue = target;

    this.stylePath(target);
  }

  stylePath(target) {
    const d = `M${this.R},0 A${this.R},${this.R} 0 1,1 ${this.R},-.01z`;

    this.path.setAttributeNS(null, "d", d);

    this.pathLength = this.path.getTotalLength();
    this.unit = this.pathLength / this.divisions;
    this.strokeLength = this.start * this.unit;
    this.target = target * this.unit;

    this.updateDash();
  }

  updateDash() {
    this.path.style.strokeDasharray =
      `${this.strokeLength},${this.pathLength - this.strokeLength}`;
  }

  updateStrokeLength() {
    const dist = this.target - this.strokeLength;
    const acc = dist * spring;

    this.vel += acc;
    this.vel *= friction;
    this.strokeLength += this.vel;

    // Vérifie si le cercle est presque rempli
    if (
      Math.abs(this.target - this.strokeLength) < 0.1 &&
      Math.abs(this.vel) < 0.1
    ) {
      this.strokeLength = this.target;
      this.vel = 0;
      this.active = false;
    }

    this.updateDash();
  }

  updateTarget(value) {
    const percentage = Math.min(100, Math.max(0, value));

    this.targetValue = percentage;
    this.text.textContent = percentage + "%";
    this.target = percentage * this.unit;
    this.active = true;
  }
}

// Création des graphiques
const charts = [
  new Chart(aPath, aText, 100),
  new Chart(bPath, bText, 100),
  new Chart(cPath, cText, 100),
  new Chart(dPath, dText, 100),
  new Chart(ePath, eText, 100),
  new Chart(fPath, fText, 100)
];

function Frame() {
  // Met à jour toutes les animations actives
  charts.forEach((chart) => {
    if (chart.active) {
      chart.updateStrokeLength();
    }
  });

  // Cherche la première compétence qui n'a pas encore démarré
  const nextIndex = charts.findIndex((chart) => !chart.started);

  if (nextIndex !== -1) {
    if (nextIndex === 0) {
      charts[0].active = true;
      charts[0].started = true;
    } else {
      const previous = charts[nextIndex - 1];

      // Lance la suivante lorsque la précédente atteint 50 %
      const progress = previous.target === 0
        ? 1
        : previous.strokeLength / previous.target;

      if (progress >= overlap) {
        charts[nextIndex].active = true;
        charts[nextIndex].started = true;
      }
    }
  }

  // Continue tant qu'une animation est active ou qu'il reste des graphiques
  const hasActive = charts.some((chart) => chart.active);
  const hasPending = charts.some((chart) => !chart.started);

  if (hasActive || hasPending) {
    rid = requestAnimationFrame(Frame);
  } else {
    rid = null;
  }
}

function startAnimation() {
  if (rid !== null) {
    cancelAnimationFrame(rid);
  }

  charts.forEach((chart) => {
    chart.active = false;
    chart.started = false;
    chart.vel = 0;
    chart.strokeLength = chart.start * chart.unit;
    chart.updateDash();
  });

  rid = requestAnimationFrame(Frame);
}

// Démarre l'animation lorsque la section graphique est visible
const sectionGraphique = document.querySelector("#section4");

const graphicObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {

      // Attend que le reveal ait rendu la section visible
      requestAnimationFrame(() => {
        startAnimation();
      });

      // L'animation des graphiques ne se lance qu'une fois
      graphicObserver.disconnect();
    }
  });
}, {
  threshold: 0.1
});

graphicObserver.observe(sectionGraphique);


// Modification manuelle des pourcentages
divs.forEach((div, index) => {
  div.addEventListener("input", () => {
    const chart = charts[index];

    if (!chart) return;

    const value = parseInt(chart.text.textContent, 10) || 0;
    chart.updateTarget(value);
  });
});

// Btn animation 

const button = document.querySelector("#confetti-btn");

const colors = [
    "#3B2E2E",
    "#FCE096",
    "#C9795B",
    "#91A58A",
    "#849EAD",
    "#FFFFFF"
];

button.addEventListener("click", () => {
    const confettiCount = 180;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");

      confetti.classList.add("confetti");

      // Position horizontale aléatoire sur tout l'écran
      confetti.style.left = Math.random() * 100 + "vw";

      // Couleur aléatoire
      confetti.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];

      // Formes variées
      const size = Math.random() * 8 + 5;
      confetti.style.width = size + "px";
      confetti.style.height = size * (Math.random() * 1.5 + 0.5) + "px";

      // Vitesse et trajectoire aléatoires
      confetti.style.setProperty(
          "--duration",
          Math.random() * 2 + 2 + "s"
      );

      confetti.style.setProperty(
          "--drift",
          (Math.random() * 300 - 150) + "px"
      );

      confetti.style.setProperty(
          "--rotation",
          (Math.random() * 1440 - 720) + "deg"
      );

      // Départ légèrement décalé pour un effet naturel
      confetti.style.animationDelay = Math.random() * 0.8 + "s";

      document.body.appendChild(confetti);

      // Supprime chaque confetti après son animation
      confetti.addEventListener("animationend", () => {
          confetti.remove();
      });
    }
});
// Remonter en haut animation
const arrowUpButton = document.querySelector('.arrowUp');

arrowUpButton.addEventListener('click', () => {

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    })

})

// Reveal animation 
const threshold = .1
const options = {
	root:null,
	rootMargin:'0px',//a partir de combien de marges faut il depasser pour etre visible
	threshold//a partir de 10% d'element on commence a faire apparaitre lelement
}

const handleIntersect = function (entries, observer) {
	entries.forEach(function (entry) {
	  if (entry.intersectionRatio > threshold) {
			entry.target.classList.add('reveal-visible');
			observer.unobserve(entry.target);
		} 
	});
}
const observer = new IntersectionObserver(handleIntersect ,options)
document.querySelectorAll('.reveal').forEach(function(r){

	observer.observe(r)

})

// Accessibilité

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const toggle = document.getElementById("filterToggle");
    const panel = document.getElementById("filterPanel");

    const inputs = document.querySelectorAll(
        'input[name="accessibilityFilter"]'
    );

    const filterClasses = [
        "fatigue",
        "dyslexie",
        "mode-nuit",
        "senior",
        "malvoyance",
        "geste-imprecis",
        "epilepsie-photosensible"
    ];

    function applyFilter(value) {
        // Retirer les anciennes classes
        body.classList.remove(...filterClasses);

        // Masquer toutes les descriptions
        document.querySelectorAll(".filter-description").forEach(desc => {
            desc.hidden = true;
        });

        // Appliquer le nouveau filtre
        if (filterClasses.includes(value)) {
            body.classList.add(value);

            const selected = document.querySelector(
                `input[name="accessibilityFilter"][value="${value}"]`
            );

            if (selected) {
                const description = selected
                    .closest(".filter-item")
                    .querySelector(".filter-description");

                description.hidden = false;
            }

            localStorage.setItem("accessibilityFilter", value);
        } else {
            localStorage.removeItem("accessibilityFilter");
        }
    }

    toggle.addEventListener("click", () => {
        panel.hidden = !panel.hidden;
        toggle.setAttribute("aria-expanded", String(!panel.hidden));
    });

  inputs.forEach(input => {
      input.addEventListener("click", () => {
          const isAlreadySelected = body.classList.contains(input.value);

          if (isAlreadySelected) {
              input.checked = false;
              applyFilter(null);
          } else {
              applyFilter(input.value);
          }
      });
  });

    // Restaurer le filtre précédent
    const savedFilter = localStorage.getItem("accessibilityFilter");

    if (filterClasses.includes(savedFilter)) {
        const input = [...inputs].find(item => item.value === savedFilter);

        if (input) {
            input.checked = true;
            applyFilter(savedFilter);
        }
    }
});

