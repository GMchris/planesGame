Plane = GameObject.extend({
    init: function () {
        this._super();
        this.image = document.createElement('img');
        this.div.appendChild(this.image);
    }
});