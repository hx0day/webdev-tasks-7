class Hrundel {
    constructor({name = 'Def', satiety = 1, mood = 1, energy = 1}={}) {
        this.name = name;
        this.satiety = satiety;
        this.mood = mood;
        this.energy = energy;
        this.saveData();
    }

    toString() {
        return '(' + this.name + ', ' + this.satiety + ', ' + this.mood + ', ' + this.energy + ')';
    }

    saveData() {
        localStorage.hrundel = JSON.stringify(this.getDataJSON());
    }

    tick() {

    }

    getDataJSON() {
        return {
            name: this.name,
            satiety: this.satiety,
            mood: this.mood,
            energy: this.energy
        }
    }

    checkDead() {
        return (this.satiety >= 0 && this.mood >= 0)
            || (this.energy >= 0 && this.mood >= 0)
            || (this.satiety >= 0 && this.energy >= 0);
    }
}