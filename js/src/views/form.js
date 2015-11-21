'use strict';

var template       = require( 'templates/form' );
window.html2canvas = require( 'html2canvas' ); // Apparently needs to be globally accessible.

/**
 * Form view.
 *
 * @type wp.Backbone.View
 */
var Form = wp.Backbone.View.extend(
	{
		template    : template( user_feedback.templates.form ),
		isActive    : false,
		bubbleOffset: {},

		/**
		 * Render the view.
		 *
		 * @returns {Form}
		 */
		render: function () {
			this.$el.html( this.template );
			this.delegateEvents();

			return this;
		},

		events: {
			'click .user-feedback-button-next': 'next'
		},

		/**
		 * Save the form fields on submission.
		 */
		next: function () {
			var name  = this.$el.find( '#user-feedback-user-name' ).val(),
			    email = this.$el.find( '#user-feedback-user-email' ).val();

			if ( '' !== name ) {
				this.model.set( 'name', name );
			}

			if ( '' !== email ) {
				this.model.set( 'email', email );
			}

			// Only run if Canvas is supported
			if ( !!window.HTMLCanvasElement ) {
				this.screenCapture();
			} else {
				this.sendData();
			}
		},

		/**
		 * Capture the entire screen in a canvas.
		 */
		screenCapture: function () {
			// Hide UI before taking the screenshot.
			jQuery( '.user-feedback-modal' ).hide();

			html2canvas( document.body ).then( _.bind( function ( canvas ) {
				console.log( canvas.toDataURL() );
				this.model.set( 'screenshot', canvas.toDataURL() );

				// Show UI again.
				jQuery( '.user-feedback-modal' ).show();

				this.sendData();
			}, this ), _.bind( function ( error ) {
				// Handle error.
			}, this ) );
		},

		/**
		 * Let the model send the data.
		 */
		sendData: function () {
			this.model.save(
				{
					success: function ( model, response, options ) {
					},
					error  : function ( model, response, options ) {
					}
				}
			);
		}
	}
);

module.exports = Form;
