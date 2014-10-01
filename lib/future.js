/** More simple list
 * ! = mandatory
 * ? = optional
 *
 ! retryFrom
 ! retryMethod
 ? default maxTries from maxTries object? maxTries: { methods: '?' }
 */


/**
 * Chaotic
 */
// !CHECK IF WE NEED THIS! \\
	/** Retries a single method without interfering with functionFlow
	 * FIRST CHECK IF WE'RE ACTUALY GOING TO NEED THIS METHOD!!!!!
	 * Can be used to retry a specific task if data isn't present
	 * without method retries that aren't required
	 * NO auto data reset is done with this method! (can be done by user)
	 *
	 * @public
	 * @arg method {string}    method to retry functionFlow from
	 * @arg cb     {function}  function to call when we're done
	 * @arg desc   {string}    error description                  optional
	 * @arg err    {object}    node error                         optional
	 *//*
	retryMethod: function retryMethod(method, cb, desc, err){
		if(!method) return this.f_next();
	},*/

	// !CHECK IF WE NEED THIS! \\
	/** Retries a method and carries on from there
	 * FIRST CHECK IF WE'RE ACTUALY GOING TO NEED THIS METHOD!!!!!
	 * NO auto data reset is done with this method! (can be done by user)
	 *
	 * @public
	 * @arg from {string}  method to retry functionFlow from
	 * @arg desc {string}  error description
	 * @arg err  {object}  node error
	 *//*
	retryFrom: function retryFrom(from, desc, err){

		if(this.f_toLog.has('retry'))
			log( RED('Retry') + (desc ? '  desc: ' + RED(desc) : '')
				+ (err  ? '  err: '  + RED(err)  : '') );

		var fromIndex = this.f_functionFlow.indexOf(from);

		// Is our 'from' method present in functionFlow?
		if(this.f_functionFlow[fromIndex]){

			console.log('this.f_maxRetries     ', this.f_maxRetries);
			console.log('');
			console.log('this.f_maxTries       ', this.f_maxTries);
			console.log('this.f_maxTries[from] ', this.f_maxTries[from]);
			console.log('');
			console.log('this.f_tries          ', this.f_tries);
			console.log('this.f_tries[from]    ', this.f_tries[from]);

			// If specific method max isn't there, just use no limits!
			// only the maxRetries.from limit
			// So we won't use from limit when it's present

			if(this.f_tries[from] || this.f_tries[from] === 0){
				this.f_tries[from] += 1;
			}

			else{
				if(this.f_maxRetries.from || this.f_tries[from] === 0){
				}
			}

		}


		// (desc || ''), (err  || {})
	},*/