/**
 * Created by hx0day on 27.04.16.
 */
function changeSkill(skill, step) {
    skill += step;
    if (skill > 1) {
        return 1;
    } else if (skill < 0) {
        return 0;
    }
    return skill
}

function run() {
    if ('hidden' in document) {
        hidden = 'hidden';
        visibilityState = 'visibilityState';
        visibilityChange = 'visibilitychange';
    } else if ('mozHidden' in document) {
        hidden = 'mozHidden';
        visibilityState = 'mozVisibilityState';
        visibilityChange = 'mozvisibilitychange';
    } else if ('webkitHidden' in document) {
        hidden = 'webkitHidden';
        visibilityState = 'webkitVisibilityState';
        visibilityChange = 'webkitvisibilitychange';
    }
    var hrundel;
    var velocityEnergy = -0.00001;
    var velocityMood = -0.00002;
    var velocitySatiety = -0.000015;
    var progressMood = document.querySelector(".js-mood-progress");
    var valueMood = document.querySelector(".js-mood-value");
    var progressSatiety = document.querySelector(".js-satiety-progress");
    var valueSatiety = document.querySelector(".js-satiety-value");
    var progressEnergy = document.querySelector(".js-energy-progress");
    var valueEnergy = document.querySelector(".js-energy-value");
    var newGame = document.querySelector(".js-new-game");
    var hrundelSvg = document.querySelector('.hrundel-svg');
    var jsMsg = document.querySelector('.js-msg');
    var jsVoiceVolume = document.querySelector('.js-voice-volume');

    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    var recognizer = new SpeechRecognition();
    recognizer.lang = 'ru-RU';
    recognizer.interimResults = true;
    recognizer.onresult = function (e) {
        var index = e.resultIndex;
        var result = e.results[index][0].transcript.trim();
        velocityMood = 0.005;
        jsMsg.innerHTML = result;
    };

    recognizer.onend = function () {
        velocityMood = -0.00002;
        jsMsg.innerHTML = '';
    };

    if (navigator.getBattery) {
        navigator
            .getBattery()
            .then(initBattery);

        function initBattery(battery) {
            battery.onchargingchange = function (e) {
                if (this.charging) {
                    velocitySatiety = 0.00005;
                } else {
                    velocitySatiety = -0.000015;
                }

            };
            battery.onchargingchange();
        }
    }

    newGame.onclick = function () {
        hrundel = new Hrundel('Htop', 1, 1, 1);
    };
    hrundelSvg.onclick = function () {
        recognizer.start()
    };

    if (!localStorage.hrundel) {
        hrundel = new Hrundel('Htop');
    } else {
        hrundel = new Hrundel(JSON.parse(localStorage.hrundel));

    }
    var refreshIntervalId;
    document.addEventListener(visibilityChange, function () {
        if (document[hidden]) {
            velocityEnergy = 0.00015;
            refreshIntervalId = setInterval(step, 16);
        } else {
            velocityEnergy = -0.00002;
            clearInterval(refreshIntervalId);
        }

    });

    if (window.speechSynthesis) {

        var msg = new SpeechSynthesisUtterance('Мяу');

        jsVoiceVolume.onchange = function () {
            msg.volume = this.value / 100;
        };
        var voices = window.speechSynthesis.getVoices();
        msg.voice = voices[10];
        msg.rate = 1; // Скорость от 0 до 10
        msg.pitch = 2; // Высота от 0 до 2
        msg.lang = "ru-RU";

        setInterval(function () {
            window.speechSynthesis.speak(msg);
        }, 5000);
    } else {
        alert('Speech Synthesis API не поддерживается');
    }


    function step() {
        if (!document[hidden]) {
            window.requestAnimationFrame(step);
        }

        hrundel.energy = changeSkill(hrundel.energy, velocityEnergy);
        hrundel.satiety = changeSkill(hrundel.satiety, velocitySatiety);
        hrundel.mood = changeSkill(hrundel.mood, velocityMood);
        if (hrundel.satiety > 100) {
            recognizer.stop();

        }
        progressEnergy.value = hrundel.energy * 100;
        valueEnergy.innerHTML = parseInt(hrundel.energy * 100) + '%';
        progressMood.value = hrundel.mood * 100;
        valueMood.innerHTML = parseInt(hrundel.mood * 100) + '%';
        progressSatiety.value = hrundel.satiety * 100;
        valueSatiety.innerHTML = parseInt(hrundel.satiety * 100) + '%';
        hrundel.saveData();
    }

    window.requestAnimationFrame(step);
}
