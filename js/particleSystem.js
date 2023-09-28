let enableParticles = true
let interactivity = true

// Configuration for tsparticles
const config = {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 4,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "window",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  };
  
  let particlesContainer = document.getElementById("particlesContainer");
  
  // Initialize tsParticles
  let particles;
  
  const toggleParticles = () => {
      if (enableParticles) {
          particles = tsParticles.load("particlesContainer", config);
      } else {
          if (particles) {
              particlesContainer.innerHTML = ""; // Remove the particle system by clearing the container
              particles = undefined; // Reset the particles variable
          }
      }
  }
  
  toggleParticles(); // Initialize particles
  
  // Listen for the "Meta" (⌘) + "M" keypress
  document.addEventListener("keydown", (k) => {
    if ((k.metaKey || k.ctrlKey) && k.key === "m") {
        enableParticles = !enableParticles;
        toggleParticles();
    }
    if ((k.metaKey || k.ctrlKey) && k.key === "k") {
        interactivity = !interactivity;
        toggleParticles();
        if(interactivity){
            config.interactivity.detect_on = "window"
        }else{
            config.interactivity.detect_on = "canvas"
        }
        toggleParticles();
    }
  });
  
