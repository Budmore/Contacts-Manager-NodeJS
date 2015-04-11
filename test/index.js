/**
 *	This aplication use mocha for test framework.
 *	http://mochajs.org/
 *
 *
 *	Available comands:
 *	"npm test"  - single time test (great for Continuous Integration)
 *	"npm run-script test-tdd" - Greate for TDD development
 *
 */


if (!process.env.SPEC) {
	console.log('### Environment: SPEC');
	process.env.SPEC = true;
}

