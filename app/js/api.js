/**
 * The interactive api
 * @type {object}
 */
main.api = {

	/**
	 * Get a specific popup object
	 * @param {number} i - number of the popup
	 * @returns {object|null} The popup api object
	 */
	popup: function(i) {
		var popup = main.object.popups.get(i);
		return popup.getApiObject() || null;
	},

	/**
	 * Get all popups
	 * @returns {object} The popups api object
	 */
	popups: function() {
		return main.object.popups.getApiObject();
	},

	/**
	 * Get a specific level object
	 * @param {number} i - The number of the level
	 * @returns {object|null} The level api object
	 */
	level: function(i) {
		var level = main.object.levels.getLevel(i);
		return level.getApiObject() || null;
	},

	/**
	 * Get all levels
	 *
	 * @returns {object} The levels api object
	 */
	levels: function() {
		return main.object.levels.getApiObject();
	},

	/**
	 * Resets the map to its initial state
	 */
	reset: function() {
		var current = main.object.levels.getIdealLevel();

		main.globals.offset.changeTo(
			-((current.size.width / 2) - (main.object.canvas.width / 2)),
			-((current.size.height / 2) - (main.object.canvas.height / 2))
		);

		main.object.levels.change(current.level);
	},

	/**
	 * Try to refit the canvas inside the container
	 */
	refit: function() {
		events.resize();
	},

	/**
	 * Zoom functions
	 */
	zoom: {

		/**
		 * Zoom to a specific level
		 * @param {number} value - number of the level
		 */
		to: function(value) {
			value = typeof value === 'number' ? value : 0;
			var offset = { x: main.object.canvas.clientWidth / 2, y: main.object.canvas.clientHeight / 2 };
			var levels = main.object.levels.getLevels([main.object.levels.current, value]);
			if(levels[1] !== null) {
				main.globals.offset.changeTo(
					offset.x - (levels[1].size.width / levels[0].size.width) *
					(offset.x - main.globals.offset.get().x),
					offset.y - (levels[1].size.height / levels[0].size.height) *
					(offset.y - main.globals.offset.get().y)
				);
				main.object.levels.change(levels[1].level);
			}
		},

		/**
		 * Zoom in 1 level
		 */
		in: function() {
			main.api.zoom.to(main.object.levels.current + 1);
		},

		/**
		 * Zoom out 1 level
		 */
		out: function() {
			main.api.zoom.to(main.object.levels.current - 1);
		}
	},

	/**
	 * Move functions
	 */
	move: {

		/**
		 * Move the map (40px * factor) to the left
		 * @param {number} factor
		 */
		left: function(factor) {
			var level = main.object.levels.getCurrent();
			main.globals.offset.changeBy(-40 * (factor || 1), 0);
			level.draw();
		},

		/**
		 * Move the map (40px * factor) to the right
		 * @param {number} factor
		 */
		right: function(factor) {
			var level = main.object.levels.getCurrent();
			main.globals.offset.changeBy(40 * (factor || 1), 0);
			level.draw();
		},

		/**
		 * Move the map (40px * factor) up
		 * @param {number} factor
		 */
		up: function(factor) {
			var level = main.object.levels.getCurrent();
			main.globals.offset.changeBy(0, -40 * (factor || 1));
			level.draw();
		},

		/**
		 * Move the map (40px * factor) down
		 * @param {number} factor
		 */
		down: function(factor) {
			var level = main.object.levels.getCurrent();
			main.globals.offset.changeBy(0, 40 * (factor || 1));
			level.draw();
		}
	},

	controls: {

		/**
		 * Array of controls to add
		 * @param {Array|Object} buttons
		 */
		add: function(buttons) {
			if(!Array.isArray(buttons)) {
				buttons = [buttons];
			}
			var control_container = helpers.createElement('div', 'm4n-custom-control-container');
			buttons.forEach(function(object) {

				var isDisabled = false;

				// If disabled properties are given
				if(object.hasOwnProperty('disabled')) {
					var checkDisabled = function() {
						isDisabled = object.disabled.callback();
						if(isDisabled) {
							control.classList.add('disabled');
						} else if(control.classList.contains('disabled')) {
							control.classList.remove('disabled');
						}
					};

					// If the object want to listen to an event
					if(object.disabled.hasOwnProperty('event')) {
						addEventListener(object.disabled.event, checkDisabled);
					}
				}

				var control = helpers.createElement('div', 'm4n-control-button', {
					'click': function() {
						if(!isDisabled) { object.click(); }
					}
				});

				control.setAttribute('data-content', object.text);
				control_container.appendChild(control);
			});
			control_container.appendChild(helpers.createElement('div', 'm4n-control-separator'));

			main.controlContainer.appendChild(control_container);
		}
	}
};