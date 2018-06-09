"use strict";

/*#####################
#### CONSTANT DATA ####
#####################*/

/* Everything below here and above the 'algorithm' section
	should be treated as constant - rarely changing unless
	Jagex decides to change the inner workings of slayer. */

/* Points needed to skip. */
var pt_thresh = 30;

/* Contains information about a given slayer master. */
function Master(n, t, p, c) {
	this.name = n;
	this.tasks = t;
	this.num_tasks = t.length;
	this.points = p;
	this.cmb_app = c;
}

/* toString for a Master. */
Master.prototype.toString = function m_toS() {
	
	var i, rv = this.name + "<br /><br />List of Tasks:";
	for (i = 0; i < this.tasks.length; i++) {
		rv += "<br /><br />";
		rv += this.tasks[i].toString();
	}
	
	return rv;
};

/* Contains info about a particular task from a particular master. */
function Task(n, s, c, f, m, w) {
		
	/* Intrinsic values. */
	this.name = n;
	this.s_reqt = s;
	this.cmb_rec = c;
	this.fblock = f;
	
	/* Master-specific values. */
	this.master = m;
	this.weight = w;
}

/* toString for a Task */
Task.prototype.toString = function t_toS() {
		
	return "Task: " + this.name + " from " + this.master + ":<br />" +
		"Slayer Level Req: " + this.s_reqt + "<br />" +
		"Combat Level Rec: " + this.cmb_rec + "<br />" +
		"Free Block: " + this.fblock;
};

/*#################
#### ALGORITHM ####
#################*/

/* An evolutionary algorithm that finds the optimal solution
	for a certain master and a given set of preferences. */

/* A positive integer that defines how precise the algorithm is:
	the larger the number is, the larger the number of tasks we test
	to figure out the score of a potential solution. */
var scale = 10000;

/* Info about the user: */
var s_lvl;
var cmb_lvl;
var num_blocks;

/* A master with the user-input e: whether or not
	it's enabled in the search algorithm. */
function UMaster(c, e) {
	this.consts = c;
	this.tasks = [];
	this.enable = e;
	this.cmb_blocks = [];
}

/* toString for a UMaster. */
UMaster.prototype.toString = function um_toS() {
	return (this.enable ? "Enabled" : "Disabled") + "nn" + this.consts.toString();
};

/* A task with the user inputs po and pr: whether or not
	a task is possible, and if so, its "preference" */
function UTask(c, po, pr) {
	this.consts = c;
	this.poss = po;
	this.pref = pr;
}

/* toString for a UTask. */
UTask.prototype.toString = function ut_toS() {
	return this.consts.toString() + "Possible? " + this.poss + "n" +
		"Preference: " + this.pref;
};

/* Compares two tasks, returning positive if a < b. */
function sortPref(a, b) {
	return b.pref - a.pref;
}

/* Gives the score of a set of blocks by doing the following:
	Starting from the highest rated tasks, does tasks until
	we have enough points to skip a task, then skips tasks
	starting from the worst tasks. Finally, returns an average
	over the done tasks. */
function score(pts, prefs, poss, blocks) {
	var i, j, k, l,
		all = prefs.length, num_tasks = 0,
		max, points = 0, thresh = pt_thresh, sc = 0;
	
	/* Finds the maximum preference. */
	for (i = 0, max = 0; i < all; i++) {
		if (poss[i]) {
			max = prefs[i].pref;
			break;
		}
	}

	/* Finds the best task that we can still be assigned. */
	i = 0;
	while (!poss[i] || blocks[i]) { i++; }
	j = 0;

	/* Finds the worst task that we can still be assigned. */
	k = all - 1;
	while (!poss[k] || blocks[k]) { k--; }
	
	/* If the worst task is already at the maximum, we know that we've
		reached a maximal solution. */
	if (prefs[k].pref === max) { return max; }
	l = scale * prefs[k].consts.weight;

	/* Do tasks from the top down, while skipping tasks from the bottom up,
		until we reach the middle. */
	while (i < k || (i === k && j < l)) {
		/* Does the best task available. */
		j++;
		num_tasks++;
		sc += prefs[i].pref;
		points += pts;
		
		/* If we've exhausted the best task, move to the next best task. */
		if (j === scale * prefs[i].consts.weight) {
			i++;
			while (i < all && (!poss[k] || blocks[k])) { i++; }
			j = 0;
		}
		
		/* While we have enough points to skip, skip from the bottom up. */
		while (points >= thresh) {
			points -= thresh;
			l--;
			
			/* If we've exhausted the worst task, move to the next worst task. */
			if (l === 0) {
				k--;
				while (k >= 0 && (!poss[k] || blocks[k])) { k--; }
				if (prefs[k].pref === max) { return max; }
				l = scale * prefs[k].consts.weight;
			}
		}
	}

	/* Do the remaining task if there is ambiguity. */
	if (i === k && j === l) {
		num_tasks++;
		sc += prefs[i].pref;
	}
	
	return sc / num_tasks;
}

/* The same as the above function, but instead of calculating the average score
	of done tasks, calculates how much extra points we have after saturating our
	solution. If a non-saturated solution is passed in, we return a negative value. */
function sat_score(pts, prefs, poss, blocks) {
	var i, j, k, l,
		all = prefs.length, done = 0, num_tasks = 0,
		max, points = 0, thresh = pt_thresh, sc = 0;
	
	/* Finds the maximum preference. */
	for (i = 0, max = 0; i < all; i++) {
		if (poss[i]) {
			max = prefs[i].pref;
			break;
		}
	}
	
	/* Finds the best task that we can still be assigned. */
	i = 0;
	while (!poss[i] || blocks[i]) { i++; }
	j = 0;

	/* Finds the worst task that we can still be assigned. */
	k = all - 1;
	while (!poss[k] || blocks[k]) { k--; }
	l = scale * prefs[k].consts.weight;
	
	/* Do tasks from the top down, while skipping tasks from the bottom up,
		until we reach the middle. */
	while (i < k || (i === k && j < l)) {
		/* Does the best task available. */
		j++;
		done++;
		sc += prefs[i].pref;
		points += pts;
		
		/* If we've exhausted the best task, move to the next best task. */
		if (j === scale * prefs[i].consts.weight) {
			i++;
			while (i < all && (!poss[k] || blocks[k])) { i++; }
			j = 0;
		}
		
		/* While we have enough points to skip, skip from the bottom up. */
		while (points >= thresh) {
			points -= thresh;
			l--;
			
			/* If we've exhausted the worst task, move to the next worst task. */
			if (l === 0) {
				k--;
				while (k >= 0 && (!poss[k] || blocks[k])) { k--; }
				l = scale * prefs[k].consts.weight;
			}
		}
	}
	
	/* Do the remaining task if there is ambiguity. */
	if (i === k && j === l) {
		done++;
		sc += prefs[i].pref;
	}
	
	/* Find out how many tasks at maximum preference there are. */
	for (i = 0; i < all; i++) {
		if (poss[i] && prefs[i].pref === max) { num_tasks += scale * prefs[i].consts.weight; }
	}
	
	/* If we're truly at a saturated solution, return the percent
		of optimal tasks we can skip, and if not, return -1 to signal
		that this solution is not saturated. */
	return sc / done === max ? 1 - done / num_tasks : -1;
}

/* Returns a string representation of the specified solution. */
function sol_repr(m, cmb_app) {
	var i, all = m.consts.num_tasks,
		tasks = m.tasks,
		sol = cmb_app ? m.cmb_sol : m.cla_sol,
		rv = "";
	
	rv = "<br />Master: " + m.consts.name + "<br />";
	rv += "<br />Saturated solution? " + (sol.sat ? "Yes." : "No.") + "<br />";
	rv += cmb_app ? "<br />Enable Combat-level appropriate tasks." :
			"<br />Disable Combat-level appropriate tasks.<br />";
	
	if (cmb_app) {
		rv += "<br />Tasks blocked by combat-appropriate tasking:<br />";
		rv += "--------------------------------------------<br />";
		for (i = 0; i < all; i++) {
			if (m.cmb_blocks[i]) { rv += tasks[i].consts.name + "<br />"; }
		}
	}
	
	rv += "<br />Unlockables:<br />";
	rv += "------------<br />";
	for (i = 0; i < all; i++) {
		if (sol.poss[i] && tasks[i].consts.fblock) {
			rv += tasks[i].consts.name + ":   " + (sol.blocks[i] ? "Disabled" : "Enabled") + "<br />";
		}
	}
	
	rv += "<br />Blocks:<br />";
	rv += "-------<br />";
	for (i = 0; i < all; i++) {
		if (!tasks[i].consts.fblock && sol.blocks[i]) { rv += tasks[i].consts.name + "<br />"; }
	}
	
	rv += "<br />Skips:<br />";
	rv += "------<br />";
	for (i = 0; i < all; i++) {
		if (sol.skips[i]) { rv += tasks[i].consts.name + "<br />"; }
	}
	
	if (!sol.sat) {
		rv += "<br />In addition, you can skip " + sol.skip_perc.toFixed(2) + "% of your " +
			tasks[sol.borderline].consts.name + " tasks.<br />";
	} else {
		rv += "<br />Of the tasks you rated highest, you can skip " + sol.skip_perc.toFixed(2) +
				"% of them, at your discretion.<br />";
		if (sol.bans < num_blocks) {
			rv += "<br />In addition, we were only able to use " + sol.bans + "/" +
				num_blocks + " of your block slots. Use the remainder however you see fit.<br />";
		}
	}
	
	rv += "<br />Average Task Quality: " + sol.score.toFixed(2) + "<br />";
	
	return rv;
}

/* Finds the best set of blocks for a master m
	with a set of possibilities poss, and returns it. */
function find_best(m, poss) {
	var i, j, k, l,
		rv = {},
		all = m.consts.num_tasks,
		change1 = 0, change2 = 0,
		bans = num_blocks, next_bans = num_blocks,
		ismax,
		sat = false, swap = false,
		pts = m.consts.points,
		thresh = pt_thresh,
		curr, spec, max,
		num, done,
		points, sc,
		tasks = m.tasks,
		blocks = [],
		skips = [];

	/* Finds the maximum preference. */
	for (i = 0, max = 0; i < all; i++) {
		if (poss[i]) {
			max = tasks[i].pref;
			break;
		}
	}

	/* Find the optimal set of blocks:
	 * Specifically, for each task:
	 *
	 *      If it's impossible or optimal (blocking it won't do anything), then ignore it.
	 *      If it's blocked, try unblocking it.
	 *      If it's unblocked, but we can freely block it, try blocking it.
	 *      If it's unblocked, but we're at block capacity:
	 *              Try exchanging it with every block we currently have.
	 *
	 * Once we've tried something, check to see if it's better than what we have.
	 * 
	 * Once we've tried all of the offspring, switch the current parent to the best offspring and repeat.
	 *
	 * In addition, if we ever achieve a saturated maximal solution, pass it off to the
	 *      saturated evolutionary algorithm.
	 */

	/* Sets the first parent to the empty set - no blocks. */
	curr = score(pts, tasks, poss, blocks);
	if (curr === max) {
		sat = true;
		change1 = -1;
	}

	/* While we're seeing change... */
	while (change1 >= 0) {
		/* If we reached an optimal solution last time, break out. */
		if (sat) { break; }

		/* For each task: */
		for (i = 0, change1 = -1; i < all; i++) {
			
			/* If it's impossible or optimal, then ignore it. */
			if (!poss[i] || tasks[i].pref === max) { continue; }

			/* If it's blocked, try unblocking it. */
			if (blocks[i]) {
				blocks[i] = false;
				spec = score(pts, tasks, poss, blocks);
				if (spec > curr) {
					swap = false;
					change1 = i;
					curr = spec;
					next_bans = tasks[i].consts.fblock ? bans : bans + 1;
				}
				
				blocks[i] = true;
				
				/* Check whether the solution we just found is optimal. */
				if (spec === max) {
					sat = true;
					break;
				}
				
			/* If it's unblocked, but we can freely block it, try blocking it. */
			} else if (!blocks[i] && (tasks[i].consts.fblock || bans > 0)) {
				blocks[i] = true;
				spec = score(pts, tasks, poss, blocks);
				if (spec > curr) {
					swap = false;
					change1 = i;
					curr = spec;
					next_bans = tasks[i].consts.fblock ? bans : bans - 1;
				}
				
				blocks[i] = false;
				if (spec === max) {
					sat = true;
					break;
				}
				
			/* If it's unblocked, but we're at block capacity: */
			} else if (!blocks[i] && !tasks[i].consts.fblock && bans <= 0) {
				/* Try exchanging it with every block we currently have. */
				for (j = 0; j < all; j++) {
					if (blocks[j] && !tasks[j].consts.fblock) {
						blocks[j] = false;
						blocks[i] = true;
						spec = score(pts, tasks, poss, blocks);
						if (spec > curr) {
							swap = true;
							change1 = i;
							change2 = j;
							curr = spec;
							next_bans = bans;
						}
						
						blocks[j] = true;
						blocks[i] = false;
						if (spec === max) {
							sat = true;
							break;
						}
					}
				}
			}
		}

		/* If we saw change, update the parent. */
		if (change1 >= 0) {
			blocks[change1] = !blocks[change1];
			bans = next_bans;
			if (swap) { blocks[change2] = !blocks[change2]; }
		}
	}
	
	/* If we reached a saturated solution, find the best such solution. */
	if (sat) {
		/* First, we enable unlockables if they're at the max, and disable them otherwise. */
		for (i = 0; i < all; i++) {
			if (poss[i] && tasks[i].consts.fblock) {
				ismax = tasks[i].pref === max;
				blocks[i] = !ismax;
			}
		}
		
		/* Restart the evolutionary algorithm, but instead optimizing for sat_score,
			and ignoring unlockables, as they've been dealt with. */
		change1 = 0;
		curr = sat_score(pts, tasks, poss, blocks);
		while (change1 >= 0) {
			for (i = 0, change1 = -1; i < all; i++) {

				/* If it's impossible, optimal, or unlockable, then ignore it. */
				if (!poss[i] || tasks[i].pref === max || tasks[i].consts.fblock) { continue; }

				/* If it's blocked, try unblocking it. */
				if (blocks[i]) {
					blocks[i] = false;
					spec = sat_score(pts, tasks, poss, blocks);
					if (spec > curr) {
						swap = false;
						change1 = i;
						curr = spec;
						next_bans = tasks[i].consts.fblock ? bans : bans + 1;
					}
					
					blocks[i] = true;
					
				/* If it's unblocked, but we can freely block it, try blocking it. */
				} else if (!blocks[i] && (tasks[i].consts.fblock || bans > 0)) {
					blocks[i] = true;
					spec = sat_score(pts, tasks, poss, blocks);
					if (spec > curr) {
						swap = false;
						change1 = i;
						curr = spec;
						next_bans = tasks[i].consts.fblock ? bans : bans - 1;
					}
					
					blocks[i] = false;
					
				/* If it's unblocked, but we're at block capacity: */
				} else if (!blocks[i] && !tasks[i].consts.fblock && bans <= 0) {
					/* Try exchanging it with every block we currently have. */
					for (j = 0; j < all; j++) {
						if (blocks[j] && !tasks[j].consts.fblock) {
							blocks[j] = false;
							blocks[i] = true;
							spec = sat_score(pts, tasks, poss, blocks);
							if (spec > curr) {
								swap = true;
								change1 = i;
								change2 = j;
								curr = spec;
								next_bans = bans;
							}
							
							blocks[j] = true;
							blocks[i] = false;
						}
					}
				}
			}
			
			/* If we saw change, update the parent. */
			if (change1 >= 0) {
				blocks[change1] = !blocks[change1];
				bans = next_bans;
				if (swap) { blocks[change2] = !blocks[change2]; }
			}
		}
	}
	
	/* Number of optimal tasks. */
	num = 0;
	for (i = 0; i < all; i++) {
		if (poss[i] && tasks[i].pref === max) { num += scale * tasks[i].consts.weight; }
	}
	
	/* Generate the list of skips, as well as the final score. */
	points = 0;
	done = 0;
	sc = 0;
	
	i = 0;
	while (!poss[i] || blocks[i]) { i++; }
	j = 0;
	
	k = all - 1;
	while (!poss[k] || blocks[k]) { k--; }
	l = scale * tasks[k].consts.weight;
	
	/* Do tasks from the top down, and skip tasks from the
	 * bottom up, until we meet in the middle. */
	while (i < k || (i === k && j < l)) {
		/* Does the best task available. */
		j++;
		points += pts;
		done++;
		sc += tasks[i].pref;
		
		/* If we've exhausted the best task, move to the next best task. */
		if (j === scale * tasks[i].consts.weight) {
			i++;
			while (i < all && (!poss[i] || blocks[i])) { i++; }
			j = 0;
		}
		
		/* While we have enough points to skip, skip from the bottom up. */
		while (points >= thresh) {
			points -= thresh;
			l--;
			
			/* If we've exhausted the worst task, move to the next worst task. */
			if (l === 0) {
				if (tasks[k].pref < max) { skips[k] = true; }
				k--;
				while (k >= 0 && (!poss[k] || blocks[k])) { k--; }
				l = scale * tasks[k].consts.weight;
			}
		}
		
		
	}
	
	/* Do the remaining task if there is ambiguity. */
	if (i === k && j === l) {
		done++;
		sc += tasks[i].pref;
		j++;
	}
	
	/* Update the solution and return it. */
	rv.score = sc / done;
	rv.poss = poss.slice();
	rv.blocks = blocks;
	rv.skips = skips;
	rv.sat = sat;
	rv.bans = num_blocks - bans;
	rv.borderline = i;
	rv.skip_perc = sat ? 100 * (1 - done / num) :
			100 * (1 - j / scale * tasks[k].consts.weight);
	
	return rv;
}

/* Finds the optimal solutions for both types of tasking for a certain master. */
function solve(m) {
	var i, min,
		all = m.consts.num_tasks,
		change,
		tasks = m.tasks,
		poss = [],
		cmb_blocks = m.cmb_blocks;
	
	/* Populate the possibility list for non-combat appropriate. */
	for (i = 0; i < all; i++) { poss[i] = s_lvl >= tasks[i].consts.s_reqt && tasks[i].poss; }
	
	/* Find the best set of blocks, for non-combat appropriate tasks. */
	m.cla_sol = find_best(m, poss);
	
	/* Initialize the combat solution to negative infinity. */
	min = {};
	min.score = Number.NEGATIVE_INFINITY;
	m.cmb_sol = min;
	
	/* If we're able to enable combat-level appropriate tasks, try that. */
	if (m.consts.cmb_app) {
		change = false;
		
		/* Update the possibility list to include combat levels,
		in the process updating the master's list of combat-blocked tasks. */
		for (i = 0; i < all; i++) {
			if (poss[i] && cmb_lvl < tasks[i].consts.cmb_rec) {
				change = true;
				cmb_blocks[i] = true;
			}
			poss[i] = poss[i] && !change;
		}
		
		/* If we saw any changes, add in the new solution. */
		if (change) { m.cmb_sol = find_best(m, poss); }
	}
}

/* Returns a string representation of the optimal solution for a master m. */
function optimal_repr(m) {
	var a = m.cla_sol, b = m.cmb_sol,
		rv = "";
	
	/* If we can't do combat-appropriate tasking, just add the non-appropriate solution. */
	if (!m.consts.cmb_app) {
		rv += sol_repr(m, false);
		return rv;
	}
	
	/* Otherwise, if one is better than the other, add the better solution. */
	if (a.score !== b.score) {
		rv += sol_repr(m, b.score > a.score) + "<br />";
		
	/* Or if they're tied, add both. */
	} else {
		rv += sol_repr(m, false) + "<br />";
		rv += "<br />~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~<br />";
		rv += sol_repr(m, true) + "<br />";
		rv += "<br />~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~<br />";
		rv += "<br />You lucky dog, both combat-enabled and non-combat enabled " +
					"have equal scores, and they're different!<br />";
		rv += "At this point, pick whichever you want, or rerun the algorithm with " +
					"more specific preferences.<br />";
	}
	
	return rv;
}

/*##########
### I.O. ###
##########*/

/* Calls the algorithm on user input. */
function alg(user_in) {
	var i, masters = [], rv,
		num_masters = 7,
		_krystilia_tasks, krystilia,
		_turael_tasks, turael,
		_mazchna_tasks, mazchna,
		_vannaka_tasks, vannaka,
		_chaeldar_tasks, chaeldar,
		_nieve_tasks, nieve,
		_duradel_tasks, duradel,
		c_masters,

		/* First, extract the form data... */
		
		/* Player Details */
		slayer = 87,
		cmb = 112,
		blocks = 6,
		
		/* Slayer Master Info */
		k_enable = true,
		t_enable = true,
		m_enable = true,
		v_enable = true,
		c_enable = true,
		n_enable = true,
		d_enable = true,
		
		wpelite = false,
		
		/* Regular Tasks */
		ab_spectres = 0,
		abyssal_dems = 0,
		adamant_drags = 0,
		ankou = 0,
		aviansies = 0,
		banshees = 0,
		basilisks = 0,
		bats = 0,
		bears = 0,
		birds = 0,
		black_dems = 0,
		black_drags = 0,
		bloodveld = 0,
		blue_drags = 0,
		bosses = 0,
		brine_rats = 0,
		bronze_drags = 0,
		catablepons = 0,
		cave_bugs = 0,
		cave_crawlers = 0,
		cave_kraken = 0,
		cave_horrors = 0,
		cave_slimes = 0,
		cockatrice = 0,
		cows = 0,
		crawling_hands = 0,
		crocodiles = 0,
		dagannoth = 0,
		dark_beasts = 0,
		desert_liz = 0,
		dogs = 0,
		dust_devils = 0,
		dwarves = 0,
		earth_warrs = 0,
		elves = 0,
		fever_spiders = 0,
		fire_giants = 0,
		flesh_crawlers = 0,
		fossil_wyvs = 0,
		gargoyles = 0,
		ghosts = 0,
		ghouls = 0,
		goblins = 0,
		great_dems = 0,
		green_drags = 0,
		harpie_bugs = 0,
		hellhounds = 0,
		hill_giants = 0,
		hobgoblins = 0,
		ice_giants = 0,
		ice_warrs = 0,
		icefiends = 0,
		infernal_mages = 0,
		iron_drags = 0,
		jellies = 0,
		jungle_horrs = 0,
		kalphites = 0,
		killerwatts = 0,
		kurasks = 0,
		less_dems = 0,
		lizardmen = 0,
		minotaurs = 0,
		mithril_drags = 0,
		mogres = 0,
		molanisks = 0,
		monkeys = 0,
		moss_giants = 0,
		mutated_zygs = 0,
		ogres = 0,
		otherworldly_beings = 0,
		nechryael = 0,
		pyrefiends = 0,
		rats = 0,
		red_drags = 0,
		rockslugs = 0,
		rune_drags = 0,
		scabarites = 0,
		scorpions = 0,
		sea_snakes = 0,
		shades = 0,
		shadow_warrs = 0,
		skeletal_wyvs = 0,
		skeletons = 0,
		smoke_devils = 0,
		spiders = 0,
		spirituals = 0,
		steel_drags = 0,
		suqahs = 0,
		terror_dogs = 0,
		trolls = 0,
		turoth = 0,
		tzhaar = 0,
		vampyres = 0,
		wall_beasts = 0,
		waterfiends = 0,
		werewolves = 0,
		wolves = 0,
		zombies = 0,

		/* Wilderness-only Tasks */
		w_bandits = 0,
		w_chaos_druids = 0,
		w_dark_warrs = 0,
		w_ents = 0,
		w_lava_drags = 0,
		w_mag_axes = 0,
		w_mammoths = 0,
		w_revenants = 0,
		w_rogues = 0,

		/* Both Tasks */
		w_ankou = 0,
		w_aviansies = 0,
		w_bears = 0,
		w_black_dems = 0,
		w_black_drags = 0,
		w_bosses = 0,
		w_earth_warrs = 0,
		w_fire_giants = 0,
		w_great_dems = 0,
		w_green_drags = 0,
		w_hellhounds = 0,
		w_ice_giants = 0,
		w_ice_warrs = 0,
		w_less_dems = 0,
		w_scorpions = 0,
		w_skeletons = 0,
		w_spiders = 0,
		w_spirituals = 0,
		
		wen = false;

	/* If the wildy is the same as normal. */
	if (wen) {
		w_bears = bears;
		w_aviansies = aviansies;
		w_ankou = ankou;
		w_black_dems = black_dems;
		w_black_drags = black_drags;
		w_bosses = bosses;
		w_earth_warrs = earth_warrs;
		w_fire_giants = fire_giants;
		w_great_dems = great_dems;
		w_green_drags = green_drags;
		w_hellhounds = hellhounds;
		w_ice_giants = ice_giants;
		w_ice_warrs = ice_warrs;
		w_less_dems = less_dems;
		w_scorpions = scorpions;
		w_skeletons = skeletons;
		w_spiders = spiders;
		w_spirituals = spirituals;
	}
	
	/* Initialize player data. */
	s_lvl = slayer;
	cmb_lvl = cmb;
	num_blocks = blocks;
	
	/* Initialize the masters. */
	// https://twitter.com/JagexAsh/status/860859015248711680
	// https://www.reddit.com/r/2007scape/comments/5zya6b/slayer_task_weightings_for_every_master/

	/* KRYSTILIA */
	_krystilia_tasks = [
		new Task("Ankou",               1,      0,      false,  "Krystilia",    6),
		new Task("Aviansies",           1,      0,      true,   "Krystilia",    7),
		new Task("Bandits",             1,      0,      false,  "Krystilia",    4),
		new Task("Bears",               1,      0,      false,  "Krystilia",    6),
		new Task("Black Demons",        1,      0,      false,  "Krystilia",    7),
		new Task("Black Dragons",       1,      0,      false,  "Krystilia",    4),
		new Task("Bosses",              1,      0,      true,   "Krystilia",    8),
		new Task("Chaos Druids",        1,      0,      false,  "Krystilia",    5),
		new Task("Dark Warriors",       1,      0,      false,  "Krystilia",    4),
		new Task("Earth Warriors",      1,      0,      false,  "Krystilia",    6),
		new Task("Ents",                1,      0,      false,  "Krystilia",    5),
		new Task("Fire Giants",         1,      0,      false,  "Krystilia",    7),
		new Task("Greater Demons",      1,      0,      false,  "Krystilia",    8),
		new Task("Green Dragons",       1,      0,      false,  "Krystilia",    4),
		new Task("Hellhounds",          1,      0,      false,  "Krystilia",    7),
		new Task("Ice Giants",          1,      0,      false,  "Krystilia",    6),
		new Task("Ice Warriors",        1,      0,      false,  "Krystilia",    7),
		new Task("Lava Dragons",        1,      0,      false,  "Krystilia",    3),
		new Task("Lesser Demons",       1,      0,      false,  "Krystilia",    6),
		new Task("Magic Axes",          1,      0,      false,  "Krystilia",    7),
		new Task("Mammoths",            1,      0,      false,  "Krystilia",    6),
		new Task("Revenants",           1,      0,      false,  "Krystilia",    5),
		new Task("Rogues",              1,      0,      false,  "Krystilia",    5),
		new Task("Scorpions",           1,      0,      false,  "Krystilia",    6),
		new Task("Skeletons",           1,      0,      false,  "Krystilia",    5),
		new Task("Spiders",             1,      0,      false,  "Krystilia",    6),
		new Task("Spiritual Creatures", 63,     0,      false,  "Krystilia",    6)
	];
	krystilia = new Master("Krystilia", _krystilia_tasks, 44.375, false);

	/* TURAEL */
	_turael_tasks = [
		new Task("Banshees",            15,     20,     false,  "Turael",       8),
		new Task("Bats",                1,      5,      false,  "Turael",       7),
		new Task("Bears",               1,      13,     false,  "Turael",       7),
		new Task("Birds",               1,      0,      false,  "Turael",       6),
		new Task("Cave Bugs",           7,      0,      false,  "Turael",       8),
		new Task("Cave Crawlers",       10,     10,     false,  "Turael",       8),
		new Task("Cave Slimes",         17,     15,     false,  "Turael",       8),
		new Task("Cows",                1,      5,      false,  "Turael",       8),
		new Task("Crawling Hands",      5,      0,      false,  "Turael",       8),
		new Task("Desert Lizards",      22,     15,     false,  "Turael",       8),
		new Task("Dogs",                1,      15,     false,  "Turael",       7),
		new Task("Dwarves",             1,      6,      false,  "Turael",       7),
		new Task("Ghosts",              1,      13,     false,  "Turael",       7),
		new Task("Goblins",             1,      0,      false,  "Turael",       7),
		new Task("Icefiends",           1,      20,     false,  "Turael",       8),
		new Task("Kalphites",           1,      15,     false,  "Turael",       6),
		new Task("Minotaurs",           1,      7,      false,  "Turael",       7),
		new Task("Monkeys",             1,      0,      false,  "Turael",       6),
		new Task("Rats",                1,      0,      false,  "Turael",       7),
		new Task("Scorpions",           1,      7,      false,  "Turael",       7),
		new Task("Skeletons",           1,      15,     false,  "Turael",       7),
		new Task("Spiders",             1,      0,      false,  "Turael",       6),
		new Task("Wolves",              1,      20,     false,  "Turael",       7),
		new Task("Zombies",             1,      10,     false,  "Turael",       7)
	];
	turael = new Master("Turael", _turael_tasks, 0, true);

	/* MAZCHNA */
	_mazchna_tasks = [
		new Task("Banshees",            15,     20,     false,  "Mazchna",      8),
		new Task("Bats",                1,      5,      false,  "Mazchna",      7),
		new Task("Bears",               1,      13,     false,  "Mazchna",      6),
		new Task("Catablepons",         1,      35,     false,  "Mazchna",      8),
		new Task("Cave Bugs",           7,      0,      false,  "Mazchna",      8),
		new Task("Cave Crawlers",       10,     10,     false,  "Mazchna",      8),
		new Task("Cave Slimes",         17,     15,     false,  "Mazchna",      8),
		new Task("Cockatrice",          25,     25,     false,  "Mazchna",      8),
		new Task("Crawling Hands",      5,      0,      false,  "Mazchna",      8),
		new Task("Desert Lizards",      22,     15,     false,  "Mazchna",      8),
		new Task("Dogs",                1,      15,     false,  "Mazchna",      7),
		new Task("Earth Warriors",      1,      35,     false,  "Mazchna",      6),
		new Task("Flesh Crawlers",      1,      15,     false,  "Mazchna",      7),
		new Task("Ghosts",              1,      13,     false,  "Mazchna",      7),
		new Task("Ghouls",              1,      25,     false,  "Mazchna",      7),
		new Task("Hill Giants",         1,      25,     false,  "Mazchna",      7),
		new Task("Hobgoblins",          1,      20,     false,  "Mazchna",      7),
		new Task("Ice Warriors",        1,      45,     false,  "Mazchna",      7),
		new Task("Kalphites",           1,      15,     false,  "Mazchna",      6),
		new Task("Killerwatts",         37,     50,     false,  "Mazchna",      6),
		new Task("Mogres",              32,     30,     false,  "Mazchna",      8),
		new Task("Pyrefiends",          30,     25,     false,  "Mazchna",      8),
		new Task("Rockslugs",           20,     20,     false,  "Mazchna",      8),
		new Task("Scorpions",           1,      7,      false,  "Mazchna",      7),
		new Task("Shades",              1,      30,     false,  "Mazchna",      8),
		new Task("Skeletons",           1,      15,     false,  "Mazchna",      7),
		new Task("Vampyres",            1,      35,     false,  "Mazchna",      6),
		new Task("Wall Beasts",         35,     30,     false,  "Mazchna",      7),
		new Task("Wolves",              1,      20,     false,  "Mazchna",      7),
		new Task("Zombies",             1,      10,     false,  "Mazchna",      7)
	];
	mazchna = new Master("Mazchna", _mazchna_tasks, 3.03, true);

	/* VANNAKA */
	_vannaka_tasks = [
		new Task("Aberrant Spectres",   60,     65,     false,  "Vannaka",      8),
		new Task("Abyssal Demons",      85,     85,     false,  "Vannaka",      5),
		new Task("Ankou",               1,      40,     false,  "Vannaka",      7),
		new Task("Banshees",            15,     20,     false,  "Vannaka",      6),
		new Task("Basilisks",           40,     40,     false,  "Vannaka",      8),
		new Task("Bloodveld",           50,     50,     false,  "Vannaka",      8),
		new Task("Blue Dragons",        1,      65,     false,  "Vannaka",      7),
		new Task("Brine Rats",          47,     45,     false,  "Vannaka",      7),
		new Task("Bronze Dragons",      1,      75,     false,  "Vannaka",      7),
		new Task("Cave Bugs",           7,      0,      false,  "Vannaka",      7),
		new Task("Cave Crawlers",       10,     10,     false,  "Vannaka",      7),
		new Task("Cave Slimes",         17,     15,     false,  "Vannaka",      7),
		new Task("Cockatrice",          25,     25,     false,  "Vannaka",      8),
		new Task("Crawling Hands",      5,      0,      false,  "Vannaka",      6),
		new Task("Crocodiles",           1,      50,     false,  "Vannaka",      6),
		new Task("Dagannoth",           1,      75,     false,  "Vannaka",      7),
		new Task("Desert Lizards",      22,     15,     false,  "Vannaka",      7),
		new Task("Dust Devils",         65,     70,     false,  "Vannaka",      8),
		new Task("Earth Warriors",      1,      35,     false,  "Vannaka",      6),
		new Task("Elves",               1,      70,     false,  "Vannaka",      7),
		new Task("Fever Spiders",       42,     40,     false,  "Vannaka",      7),
		new Task("Fire Giants",         1,      65,     false,  "Vannaka",      7),
		new Task("Gargoyles",           75,     80,     false,  "Vannaka",      5),
		new Task("Ghouls",              1,      25,     false,  "Vannaka",      7),
		new Task("Green Dragons",       1,      52,     false,  "Vannaka",      6),
		new Task("Harpie Bug Swarms",   25,     45,     false,  "Vannaka",      8),
		new Task("Hellhounds",          1,      75,     false,  "Vannaka",      7),
		new Task("Hill Giants",         1,      25,     false,  "Vannaka",      7),
		new Task("Hobgoblins",          1,      20,     false,  "Vannaka",      7),
		new Task("Ice Giants",          1,      50,     false,  "Vannaka",      7),
		new Task("Ice Warriors",        1,      45,     false,  "Vannaka",      7),
		new Task("Infernal Mages",      45,     40,     false,  "Vannaka",      8),
		new Task("Jellies",             52,     57,     false,  "Vannaka",      8),
		new Task("Jungle Horrors",      1,      65,     false,  "Vannaka",      8),
		new Task("Kalphites",           1,      15,     false,  "Vannaka",      7),
		new Task("Killerwatts",         37,     50,     false,  "Vannaka",      6),
		new Task("Kurasks",             70,     65,     false,  "Vannaka",      7),
		new Task("Lesser Demons",       1,      60,     false,  "Vannaka",      7),
		new Task("Mogres",              32,     30,     false,  "Vannaka",      7),
		new Task("Molanisks",           39,     50,     false,  "Vannaka",      7),
		new Task("Moss Giants",         1,      40,     false,  "Vannaka",      7),
		new Task("Nechryael",           80,     85,     false,  "Vannaka",      5),
		new Task("Ogres",               1,      40,     false,  "Vannaka",      7),
		new Task("Otherworldly Beings", 1,      40,     false,  "Vannaka",      8),
		new Task("Pyrefiends",          30,     25,     false,  "Vannaka",      8),
		new Task("Rockslugs",           20,     20,     false,  "Vannaka",      7),
		new Task("Sea Snakes",          1,      50,     false,  "Vannaka",      6),
		new Task("Shades",              1,      30,     false,  "Vannaka",      8),
		new Task("Shadow Warriors",     1,      60,     false,  "Vannaka",      8),
		new Task("Spiritual Creatures", 63,     60,     false,  "Vannaka",      8),
		new Task("Terror Dogs",         40,     60,     false,  "Vannaka",      6),
		new Task("Trolls",              1,      60,     false,  "Vannaka",      7),
		new Task("Turoth",              55,     60,     false,  "Vannaka",      8),
		new Task("Vampyres",            1,      35,     false,  "Vannaka",      7),
		new Task("Wall Beasts",         35,     30,     false,  "Vannaka",      6),
		new Task("Werewolves",          1,      60,     false,  "Vannaka",      7)
	];
	vannaka = new Master("Vannaka", _vannaka_tasks, 7.1, true);

	/* CHAELDAR */
	_chaeldar_tasks = [
		new Task("Aberrant Spectres",   60,     65,     false,  "Chaeldar",     8),
		new Task("Abyssal Demons",      85,     85,     false,  "Chaeldar",     12),
		new Task("Aviansies",           1,      0,      true,   "Chaeldar",     9),
		new Task("Banshees",            15,     20,     false,  "Chaeldar",     5),
		new Task("Basilisks",           40,     40,     false,  "Chaeldar",     7),
		new Task("Black Demons",        1,      80,     false,  "Chaeldar",     10),
		new Task("Bloodveld",           50,     50,     false,  "Chaeldar",     8),
		new Task("Blue Dragons",        1,      65,     false,  "Chaeldar",     8),
		new Task("Brine Rats",          47,     45,     false,  "Chaeldar",     7),
		new Task("Bronze Dragons",      1,      75,     false,  "Chaeldar",     11),
		new Task("Cave Crawlers",       10,     10,     false,  "Chaeldar",     5),
		new Task("Cave Horrors",        58,     85,     false,  "Chaeldar",     10),
		new Task("Cave Kraken",         87,     80,     false,  "Chaeldar",     12),
		new Task("Cave Slimes",         17,     15,     false,  "Chaeldar",     6),
		new Task("Cockatrice",          25,     25,     false,  "Chaeldar",     6),
		new Task("Dagannoth",           1,      75,     false,  "Chaeldar",     11),
		new Task("Desert Lizards",      22,     15,     false,  "Chaeldar",     5),
		new Task("Dust Devils",         65,     70,     false,  "Chaeldar",     9),
		new Task("Elves",               1,      70,     false,  "Chaeldar",     8),
		new Task("Fever Spiders",       42,     40,     false,  "Chaeldar",     7),
		new Task("Fire Giants",         1,      65,     false,  "Chaeldar",     12),
		new Task("Fossil Wyverns",      66,     0,      true,   "Chaeldar",     7),
		new Task("Gargoyles",           75,     80,     false,  "Chaeldar",     11),
		new Task("Greater Demons",      1,      75,     false,  "Chaeldar",     9),
		new Task("Harpie Bug Swarms",   25,     45,     false,  "Chaeldar",     6),
		new Task("Hellhounds",          1,      75,     false,  "Chaeldar",     9),
		new Task("Infernal Mages",      45,     40,     false,  "Chaeldar",     7),
		new Task("Iron Dragons",        1,      80,     false,  "Chaeldar",     12),
		new Task("Jellies",             52,     57,     false,  "Chaeldar",     10),
		new Task("Jungle Horrors",      1,      65,     false,  "Chaeldar",     10),
		new Task("Kalphites",           1,      15,     false,  "Chaeldar",     11),
		new Task("Kurasks",             70,     65,     false,  "Chaeldar",     12),
		new Task("Lesser Demons",       1,      60,     false,  "Chaeldar",     9),
		new Task("Lizardmen",           1,      0,      true,   "Chaeldar",     8),
		new Task("Mogres",              32,     30,     false,  "Chaeldar",     6),
		new Task("Molanisks",           39,     50,     false,  "Chaeldar",     6),
		new Task("Mutated Zygomites",   57,     60,     false,  "Chaeldar",     7),
		new Task("Nechryael",           80,     85,     false,  "Chaeldar",     12),
		new Task("Pyrefiends",          30,     25,     false,  "Chaeldar",     6),
		new Task("Rockslugs",           20,     20,     false,  "Chaeldar",     5),
		new Task("Shadow Warriors",     1,      60,     false,  "Chaeldar",     8),
		new Task("Skeletal Wyverns",    72,     70,     false,  "Chaeldar",     7),
		new Task("Spiritual Creatures", 63,     60,     false,  "Chaeldar",     12),
		new Task("Steel Dragons",       1,      85,     false,  "Chaeldar",     9),
		new Task("Trolls",              1,      60,     false,  "Chaeldar",     11),
		new Task("Turoth",              55,     60,     false,  "Chaeldar",     10),
		new Task("TzHaar",              1,      0,      true,   "Chaeldar",     10), //TODO
		new Task("Wall Beasts",         35,     30,     false,  "Chaeldar",     6)
	];
	chaeldar = new Master("Chaeldar", _chaeldar_tasks, 17.75, true);

	/* NIEVE */
	_nieve_tasks = [
		new Task("Aberrant Spectres",   60,     65,     false,  "Nieve",        6),
		new Task("Abyssal Demons",      85,     85,     false,  "Nieve",        9),
		new Task("Adamant Dragons",     1,      0,      false,  "Nieve",        2),
		new Task("Ankou",               1,      40,     false,  "Nieve",        5),
		new Task("Aviansies",           1,      0,      true,   "Nieve",        6),
		new Task("Black Demons",        1,      80,     false,  "Nieve",        9),
		new Task("Black Dragons",       1,      80,     false,  "Nieve",        6),
		new Task("Bloodveld",           50,     50,     false,  "Nieve",        9),
		new Task("Blue Dragons",        1,      65,     false,  "Nieve",        4),
		new Task("Bosses",              1,      0,      true,   "Nieve",        8),
		new Task("Brine Rats",          47,     45,     false,  "Nieve",        3),
		new Task("Cave Horrors",        58,     85,     false,  "Nieve",        5),
		new Task("Cave Kraken",         87,     80,     false,  "Nieve",        6),
		new Task("Dagannoth",           1,      75,     false,  "Nieve",        8),
		new Task("Dark Beasts",         90,     90,     false,  "Nieve",        5),
		new Task("Dust Devils",         65,     70,     false,  "Nieve",        6),
		new Task("Elves",               1,      70,     false,  "Nieve",        4),
		new Task("Fire Giants",         1,      65,     false,  "Nieve",        9),
		new Task("Fossil Wyverns",      66,     0,      true,   "Nieve",        5),
		new Task("Gargoyles",           75,     80,     false,  "Nieve",        6),
		new Task("Greater Demons",      1,      75,     false,  "Nieve",        7),
		new Task("Hellhounds",          1,      75,     false,  "Nieve",        8),
		new Task("Iron Dragons",        1,      80,     false,  "Nieve",        5),
		new Task("Kalphites",           1,      15,     false,  "Nieve",        9),
		new Task("Kurasks",             70,     65,     false,  "Nieve",        3),
		new Task("Lizardmen",           1,      0,      true,   "Nieve",        8),
		new Task("Mithril Dragons",     1,      0,      true,   "Nieve",        5),
		new Task("Mutated Zygomites",   57,     60,     false,  "Nieve",        2),
		new Task("Nechryael",           80,     85,     false,  "Nieve",        7),
		new Task("Red Dragons",         1,      0,      true,   "Nieve",        5),
		new Task("Rune Dragons",        1,      0,      false,  "Nieve",        2),
		new Task("Scabarites",          1,      85,     false,  "Nieve",        4),
		new Task("Skeletal Wyverns",    72,     70,     false,  "Nieve",        5),
		new Task("Smoke Devils",        93,     85,     false,  "Nieve",        7),
		new Task("Spiritual Creatures", 63,     60,     false,  "Nieve",        6),
		new Task("Steel Dragons",       1,      85,     false,  "Nieve",        5),
		new Task("Suqahs",              1,      85,     false,  "Nieve",        8),
		new Task("Trolls",              1,      60,     false,  "Nieve",        6),
		new Task("Turoth",              55,     60,     false,  "Nieve",        3),
		new Task("TzHaar",              1,      0,      true,   "Nieve",        10)
	];
	nieve = new Master("Nieve", _nieve_tasks, wpelite ? 26.625 : 21.3, true);

	/* DURADEL */
	_duradel_tasks = [
		new Task("Aberrant Spectres",   60,     65,     false,  "Duradel",      7),
		new Task("Abyssal Demons",      85,     85,     false,  "Duradel",      12),
		new Task("Adamant Dragons",     1,      0,      false,  "Duradel",      2),
		new Task("Ankou",               1,      40,     false,  "Duradel",      5),
		new Task("Aviansies",           1,      0,      true,   "Duradel",      8),
		new Task("Black Demons",        1,      80,     false,  "Duradel",      8),
		new Task("Black Dragons",       1,      80,     false,  "Duradel",      9),
		new Task("Bloodveld",           50,     50,     false,  "Duradel",      8),
		new Task("Blue Dragons",        1,      65,     false,  "Duradel",      4),
		new Task("Bosses",              1,      0,      true,   "Duradel",      12),
		new Task("Cave Horrors",        58,     85,     false,  "Duradel",      4),
		new Task("Cave Kraken",         87,     80,     false,  "Duradel",      9),
		new Task("Dagannoth",           1,      75,     false,  "Duradel",      9),
		new Task("Dark Beasts",         90,     90,     false,  "Duradel",      11),
		new Task("Dust Devils",         65,     70,     false,  "Duradel",      5),
		new Task("Elves",               1,      70,     false,  "Duradel",      4),
		new Task("Fire Giants",         1,      65,     false,  "Duradel",      7),
		new Task("Fossil Wyverns",      66,     0,      true,   "Duradel",      5),
		new Task("Gargoyles",           75,     80,     false,  "Duradel",      8),
		new Task("Greater Demons",      1,      75,     false,  "Duradel",      9),
		new Task("Hellhounds",          1,      75,     false,  "Duradel",      10),
		new Task("Iron Dragons",        1,      80,     false,  "Duradel",      5),
		new Task("Kalphites",           1,      15,     false,  "Duradel",      9),
		new Task("Kurasks",             70,     65,     false,  "Duradel",      4),
		new Task("Lizardmen",           1,      0,      true,   "Duradel",      10),
		new Task("Mithril Dragons",     1,      0,      true,   "Duradel",      9),
		new Task("Mutated Zygomites",   57,     60,     false,  "Duradel",      2),
		new Task("Nechryael",           80,     85,     false,  "Duradel",      9),
		new Task("Red Dragons",         1,      0,      true,   "Duradel",      8),
		new Task("Rune Dragons",        1,      0,      false,  "Duradel",      2),
		new Task("Skeletal Wyverns",    72,     70,     false,  "Duradel",      7),
		new Task("Smoke Devils",        93,     85,     false,  "Duradel",      9),
		new Task("Spiritual Creatures", 63,     60,     false,  "Duradel",      7),
		new Task("Steel Dragons",       1,      85,     false,  "Duradel",      7),
		new Task("Suqahs",              1,      85,     false,  "Duradel",      8),
		new Task("Trolls",              1,      60,     false,  "Duradel",      6),
		new Task("TzHaar",              1,      0,      true,   "Duradel",      10),
		new Task("Waterfiends",         1,      75,     false,  "Duradel",      2)
	];
	duradel = new Master("Duradel", _duradel_tasks, 26.625, true);

	c_masters = [
		krystilia,
		turael,
		mazchna,
		vannaka,
		chaeldar,
		nieve,
		duradel
	];

	/* Krystilia */
	masters[0] = new UMaster(c_masters[0], k_enable);
	
	/* Turael */
	masters[1] = new UMaster(c_masters[1], t_enable);
	
	/* Mazchna */
	masters[2] = new UMaster(c_masters[2], m_enable);
	
	/* Vannaka */
	masters[3] = new UMaster(c_masters[3], v_enable);
	
	/* Chaeldar */
	masters[4] = new UMaster(c_masters[4], c_enable);
	
	/* Nieve */
	masters[5] = new UMaster(c_masters[5], n_enable);
	
	/* Duradel */
	masters[6] = new UMaster(c_masters[6], d_enable);
	

	/* Assign the preferences to the tasks. */
	
	/* Aberrant Spectres */
	masters[3].tasks[0] = new UTask(masters[3].consts.tasks[0], true, ab_spectres);    //Vannaka
	masters[4].tasks[0] = new UTask(masters[4].consts.tasks[0], true, ab_spectres);    //Chaeldar
	masters[5].tasks[0] = new UTask(masters[5].consts.tasks[0], true, ab_spectres);    //Nieve
	masters[6].tasks[0] = new UTask(masters[6].consts.tasks[0], true, ab_spectres);    //Duradel

	/* Abyssal Demons */
	masters[3].tasks[1] = new UTask(masters[3].consts.tasks[1], true, abyssal_dems);    //Vannaka
	masters[4].tasks[1] = new UTask(masters[4].consts.tasks[1], true, abyssal_dems);    //Chaeldar
	masters[5].tasks[1] = new UTask(masters[5].consts.tasks[1], true, abyssal_dems);    //Nieve
	masters[6].tasks[1] = new UTask(masters[6].consts.tasks[1], true, abyssal_dems);    //Duradel

	/* Adamant Dragons */
	masters[5].tasks[2] = new UTask(masters[5].consts.tasks[2], true, adamant_drags);    //Nieve
	masters[6].tasks[2] = new UTask(masters[6].consts.tasks[2], true, adamant_drags);    //Duradel

	/* Ankou */
	masters[0].tasks[0] = new UTask(masters[0].consts.tasks[0], true, w_ankou);  //Krystilia
	masters[3].tasks[2] = new UTask(masters[3].consts.tasks[2], true, ankou);   //Vannaka
	masters[5].tasks[3] = new UTask(masters[5].consts.tasks[3], true, ankou);   //Nieve
	masters[6].tasks[3] = new UTask(masters[6].consts.tasks[3], true, ankou);   //Duradel

	/* Aviansies */
	masters[0].tasks[1] = new UTask(masters[0].consts.tasks[1], true, w_aviansies);  //Krystilia
	masters[4].tasks[2] = new UTask(masters[4].consts.tasks[2], true, aviansies);   //Chaeldar
	masters[5].tasks[4] = new UTask(masters[5].consts.tasks[4], true, aviansies);   //Nieve
	masters[6].tasks[4] = new UTask(masters[6].consts.tasks[4], true, aviansies);   //Duradel

	/* Bandits */
	masters[0].tasks[2] = new UTask(masters[0].consts.tasks[2], true, w_bandits);   //Krystilia

	/* Banshees */
	masters[1].tasks[0] = new UTask(masters[1].consts.tasks[0], true, banshees);    //Turael
	masters[2].tasks[0] = new UTask(masters[2].consts.tasks[0], true, banshees);    //Mazchna
	masters[3].tasks[3] = new UTask(masters[3].consts.tasks[3], true, banshees);    //Vannaka
	masters[4].tasks[3] = new UTask(masters[4].consts.tasks[3], true, banshees);    //Chaeldar

	/* Basilisks */
	masters[3].tasks[4] = new UTask(masters[3].consts.tasks[4], true, basilisks);    //Vannaka
	masters[4].tasks[4] = new UTask(masters[4].consts.tasks[4], true, basilisks);    //Chaeldar

	/* Bats */
	masters[1].tasks[1] = new UTask(masters[1].consts.tasks[1], true, bats);    //Turael
	masters[2].tasks[1] = new UTask(masters[2].consts.tasks[1], true, bats);    //Mazchna

	/* Bears */
	masters[0].tasks[3] = new UTask(masters[0].consts.tasks[3], true, w_bears);  //Krystilia
	masters[1].tasks[2] = new UTask(masters[1].consts.tasks[2], true, bears);   //Turael
	masters[2].tasks[2] = new UTask(masters[2].consts.tasks[2], true, bears);   //Mazchna

	/* Birds */
	masters[1].tasks[3] = new UTask(masters[1].consts.tasks[3], true, birds);    //Turael

	/* Black Demons */
	masters[0].tasks[4] = new UTask(masters[0].consts.tasks[4], true, w_black_dems);   //Krystilia
	masters[4].tasks[5] = new UTask(masters[4].consts.tasks[5], true, black_dems);    //Chaeldar
	masters[5].tasks[5] = new UTask(masters[5].consts.tasks[5], true, black_dems);    //Nieve
	masters[6].tasks[5] = new UTask(masters[6].consts.tasks[5], true, black_dems);    //Duradel

	/* Black Dragons */
	masters[0].tasks[5] = new UTask(masters[0].consts.tasks[5], true, w_black_drags);   //Krystilia
	masters[5].tasks[6] = new UTask(masters[5].consts.tasks[6], true, black_drags);    //Nieve
	masters[6].tasks[6] = new UTask(masters[6].consts.tasks[6], true, black_drags);    //Duradel

	/* Bloodveld */
	masters[3].tasks[5] = new UTask(masters[3].consts.tasks[5], true, bloodveld);    //Vannaka
	masters[4].tasks[6] = new UTask(masters[4].consts.tasks[6], true, bloodveld);    //Chaeldar
	masters[5].tasks[7] = new UTask(masters[5].consts.tasks[7], true, bloodveld);    //Nieve
	masters[6].tasks[7] = new UTask(masters[6].consts.tasks[7], true, bloodveld);    //Duradel

	/* Blue Dragons */
	masters[3].tasks[6] = new UTask(masters[3].consts.tasks[6], true, blue_drags);    //Vannaka
	masters[4].tasks[7] = new UTask(masters[4].consts.tasks[7], true, blue_drags);    //Chaeldar
	masters[5].tasks[8] = new UTask(masters[5].consts.tasks[8], true, blue_drags);    //Nieve
	masters[6].tasks[8] = new UTask(masters[6].consts.tasks[8], true, blue_drags);    //Duradel

	/* Bosses */
	masters[0].tasks[6] = new UTask(masters[0].consts.tasks[6], true, w_bosses);   //Krystilia
	masters[5].tasks[9] = new UTask(masters[5].consts.tasks[9], true, bosses);    //Nieve
	masters[6].tasks[9] = new UTask(masters[6].consts.tasks[9], true, bosses);    //Duradel

	/* Brine Rats */
	masters[3].tasks[7] = new UTask(masters[3].consts.tasks[7], true, brine_rats);     //Vannaka
	masters[4].tasks[8] = new UTask(masters[4].consts.tasks[8], false, brine_rats);    //Chaeldar
	masters[5].tasks[10] = new UTask(masters[5].consts.tasks[10], true, brine_rats);   //Nieve

	/* Bronze Dragons */
	masters[3].tasks[8] = new UTask(masters[3].consts.tasks[8], true, bronze_drags);    //Vannaka
	masters[4].tasks[9] = new UTask(masters[4].consts.tasks[9], true, bronze_drags);    //Chaeldar

	/* Catablepons */
	masters[2].tasks[3] = new UTask(masters[2].consts.tasks[3], true, catablepons);   //Mazchna

	/* Cave Bugs */
	masters[1].tasks[4] = new UTask(masters[1].consts.tasks[4], true, cave_bugs);   //Turael
	masters[2].tasks[4] = new UTask(masters[2].consts.tasks[4], true, cave_bugs);   //Mazchna
	masters[3].tasks[9] = new UTask(masters[3].consts.tasks[9], true, cave_bugs);   //Vannaka

	/* Cave Crawlers */
	masters[1].tasks[5] = new UTask(masters[1].consts.tasks[5], true, cave_crawlers);     //Turael
	masters[2].tasks[5] = new UTask(masters[2].consts.tasks[5], true, cave_crawlers);     //Mazchna
	masters[3].tasks[10] = new UTask(masters[3].consts.tasks[10], true, cave_crawlers);   //Vannaka
	masters[4].tasks[10] = new UTask(masters[4].consts.tasks[10], true, cave_crawlers);   //Chaeldar

	/* Cave Horrors */
	masters[4].tasks[11] = new UTask(masters[4].consts.tasks[11], true, cave_horrors);   //Chaeldar
	masters[5].tasks[11] = new UTask(masters[5].consts.tasks[11], true, cave_horrors);   //Nieve
	masters[6].tasks[10] = new UTask(masters[6].consts.tasks[10], true, cave_horrors);   //Duradel

	/* Cave Kraken */
	masters[4].tasks[12] = new UTask(masters[4].consts.tasks[12], true, cave_kraken);   //Chaeldar
	masters[5].tasks[12] = new UTask(masters[5].consts.tasks[12], true, cave_kraken);   //Nieve
	masters[6].tasks[11] = new UTask(masters[6].consts.tasks[11], true, cave_kraken);   //Duradel

	/* Cave Slimes */
	masters[1].tasks[6] = new UTask(masters[1].consts.tasks[6], true, cave_slimes);     //Turael
	masters[2].tasks[6] = new UTask(masters[2].consts.tasks[6], true, cave_slimes);     //Mazchna
	masters[3].tasks[11] = new UTask(masters[3].consts.tasks[11], true, cave_slimes);   //Vannaka
	masters[4].tasks[13] = new UTask(masters[4].consts.tasks[13], true, cave_slimes);   //Chaeldar

	/* Chaos Druids */
	masters[0].tasks[7] = new UTask(masters[0].consts.tasks[7], true, w_chaos_druids);   //Krystilia

	/* Cockatrice */
	masters[2].tasks[7] = new UTask(masters[2].consts.tasks[7], true, cockatrice);     //Mazchna
	masters[3].tasks[12] = new UTask(masters[3].consts.tasks[12], true, cockatrice);   //Vannaka
	masters[4].tasks[14] = new UTask(masters[4].consts.tasks[14], true, cockatrice);   //Chaeldar

	/* Cows */
	masters[1].tasks[7] = new UTask(masters[1].consts.tasks[7], true, cows);    //Turael

	/* Crawling Hands */
	masters[1].tasks[8] = new UTask(masters[1].consts.tasks[8], true, crawling_hands);     //Turael
	masters[2].tasks[8] = new UTask(masters[2].consts.tasks[8], true, crawling_hands);     //Mazchna
	masters[3].tasks[13] = new UTask(masters[3].consts.tasks[13], true, crawling_hands);   //Vannaka

	/* Crocodiles */
	masters[3].tasks[14] = new UTask(masters[3].consts.tasks[14], true, crocodiles);   //Vannaka

	/* Dagannoth */
	masters[3].tasks[15] = new UTask(masters[3].consts.tasks[15], true, dagannoth);   //Vannaka
	masters[4].tasks[15] = new UTask(masters[4].consts.tasks[15], true, dagannoth);   //Chaeldar
	masters[5].tasks[13] = new UTask(masters[5].consts.tasks[13], true, dagannoth);   //Nieve
	masters[6].tasks[12] = new UTask(masters[6].consts.tasks[12], true, dagannoth);   //Duradel

	/* Dark Beasts */
	masters[5].tasks[14] = new UTask(masters[5].consts.tasks[14], true, dark_beasts);   //Nieve
	masters[6].tasks[13] = new UTask(masters[6].consts.tasks[13], true, dark_beasts);   //Duradel

	/* Dark Warriors */
	masters[0].tasks[8] = new UTask(masters[0].consts.tasks[8], true, w_dark_warrs);   //Krystilia

	/* Desert Lizards */
	masters[1].tasks[9] = new UTask(masters[1].consts.tasks[9], true, desert_liz);     //Turael
	masters[2].tasks[9] = new UTask(masters[2].consts.tasks[9], true, desert_liz);     //Mazchna
	masters[3].tasks[16] = new UTask(masters[3].consts.tasks[16], true, desert_liz);   //Vannaka
	masters[4].tasks[16] = new UTask(masters[4].consts.tasks[16], true, desert_liz);   //Chaeldar

	/* Dogs */
	masters[1].tasks[10] = new UTask(masters[1].consts.tasks[10], true, dogs);   //Turael
	masters[2].tasks[10] = new UTask(masters[2].consts.tasks[10], true, dogs);   //Mazchna

	/* Dust Devils */
	masters[3].tasks[17] = new UTask(masters[3].consts.tasks[17], true, dust_devils);   //Vannaka
	masters[4].tasks[17] = new UTask(masters[4].consts.tasks[17], true, dust_devils);   //Chaeldar
	masters[5].tasks[15] = new UTask(masters[5].consts.tasks[15], true, dust_devils);   //Nieve
	masters[6].tasks[14] = new UTask(masters[6].consts.tasks[14], true, dust_devils);   //Duradel

	/* Dwarves */
	masters[1].tasks[11] = new UTask(masters[1].consts.tasks[11], true, dwarves);    //Turael

	/* Earth Warriors */
	masters[0].tasks[9] = new UTask(masters[0].consts.tasks[9], true, w_earth_warrs);    //Krystilia
	masters[2].tasks[11] = new UTask(masters[2].consts.tasks[11], true, earth_warrs);   //Mazchna
	masters[3].tasks[18] = new UTask(masters[3].consts.tasks[18], true, earth_warrs);   //Vannaka

	/* Elves */
	masters[3].tasks[19] = new UTask(masters[3].consts.tasks[19], true, elves);   //Vannaka
	masters[4].tasks[18] = new UTask(masters[4].consts.tasks[18], true, elves);   //Chaeldar
	masters[5].tasks[16] = new UTask(masters[5].consts.tasks[16], true, elves);   //Nieve
	masters[6].tasks[15] = new UTask(masters[6].consts.tasks[15], true, elves);   //Duradel

	/* Ents */
	masters[0].tasks[10] = new UTask(masters[0].consts.tasks[10], true, w_ents);  //Krystilia

	/* Fever Spiders */
	masters[3].tasks[20] = new UTask(masters[3].consts.tasks[20], true, fever_spiders);   //Vannaka
	masters[4].tasks[19] = new UTask(masters[4].consts.tasks[19], true, fever_spiders);   //Chaeldar

	/* Fire Giants */
	masters[0].tasks[11] = new UTask(masters[0].consts.tasks[11], true, w_fire_giants);  //Krystilia
	masters[3].tasks[21] = new UTask(masters[3].consts.tasks[21], true, fire_giants);   //Vannaka
	masters[4].tasks[20] = new UTask(masters[4].consts.tasks[20], true, fire_giants);   //Chaeldar
	masters[5].tasks[17] = new UTask(masters[5].consts.tasks[17], true, fire_giants);   //Nieve
	masters[6].tasks[16] = new UTask(masters[6].consts.tasks[16], true, fire_giants);   //Duradel

	/* Flesh Crawlers */
	masters[2].tasks[12] = new UTask(masters[2].consts.tasks[12], true, flesh_crawlers);   //Mazchna

	/* Fossil Island Wyverns */
	masters[4].tasks[21] = new UTask(masters[4].consts.tasks[21], true, fossil_wyvs);   //Chaeldar
	masters[5].tasks[18] = new UTask(masters[5].consts.tasks[18], true, fossil_wyvs);   //Nieve
	masters[6].tasks[17] = new UTask(masters[6].consts.tasks[17], true, fossil_wyvs);   //Duradel

	/* Gargoyles */
	masters[3].tasks[22] = new UTask(masters[3].consts.tasks[22], true, gargoyles);   //Vannaka
	masters[4].tasks[22] = new UTask(masters[4].consts.tasks[22], true, gargoyles);   //Chaeldar
	masters[5].tasks[19] = new UTask(masters[5].consts.tasks[19], true, gargoyles);   //Nieve
	masters[6].tasks[18] = new UTask(masters[6].consts.tasks[18], true, gargoyles);   //Duradel

	/* Ghosts */
	masters[1].tasks[12] = new UTask(masters[1].consts.tasks[12], true, ghosts);   //Turael
	masters[2].tasks[13] = new UTask(masters[2].consts.tasks[13], true, ghosts);   //Mazchna

	/* Ghouls */
	masters[2].tasks[14] = new UTask(masters[2].consts.tasks[14], true, ghouls);   //Mazchna
	masters[3].tasks[23] = new UTask(masters[3].consts.tasks[23], true, ghouls);   //Vannaka

	/* Goblins */
	masters[1].tasks[13] = new UTask(masters[1].consts.tasks[13], true, goblins);    //Turael

	/* Greater Demons */
	masters[0].tasks[12] = new UTask(masters[0].consts.tasks[12], true, w_great_dems);  //Krystilia
	masters[4].tasks[23] = new UTask(masters[4].consts.tasks[23], true, great_dems);   //Chaeldar
	masters[5].tasks[20] = new UTask(masters[5].consts.tasks[20], true, great_dems);   //Nieve
	masters[6].tasks[19] = new UTask(masters[6].consts.tasks[19], true, great_dems);   //Duradel
	
	/* Green Dragons */
	masters[0].tasks[13] = new UTask(masters[0].consts.tasks[13], true, w_green_drags);  //Krystilia
	masters[3].tasks[24] = new UTask(masters[3].consts.tasks[24], true, green_drags);   //Vannaka
	
	/* Harpie Bug Swarms */
	masters[3].tasks[25] = new UTask(masters[3].consts.tasks[25], true, harpie_bugs);   //Vannaka
	masters[4].tasks[24] = new UTask(masters[4].consts.tasks[24], true, harpie_bugs);   //Chaeldar
	
	/* Hellhounds */
	masters[0].tasks[14] = new UTask(masters[0].consts.tasks[14], true, w_hellhounds);  //Krystilia
	masters[3].tasks[26] = new UTask(masters[3].consts.tasks[26], true, hellhounds);   //Vannaka
	masters[4].tasks[25] = new UTask(masters[4].consts.tasks[25], true, hellhounds);   //Chaeldar
	masters[5].tasks[21] = new UTask(masters[5].consts.tasks[21], true, hellhounds);   //Nieve
	masters[6].tasks[20] = new UTask(masters[6].consts.tasks[20], true, hellhounds);   //Duradel
	
	/* Hill Giants */
	masters[2].tasks[15] = new UTask(masters[2].consts.tasks[15], true, hill_giants);   //Mazchna
	masters[3].tasks[27] = new UTask(masters[3].consts.tasks[27], true, hill_giants);   //Vannaka
	
	/* Hobgoblins */
	masters[2].tasks[16] = new UTask(masters[2].consts.tasks[16], true, hobgoblins);   //Mazchna
	masters[3].tasks[28] = new UTask(masters[3].consts.tasks[28], true, hobgoblins);   //Vannaka
	
	/* Ice Giants */
	masters[0].tasks[15] = new UTask(masters[0].consts.tasks[15], true, w_ice_giants);  //Krystilia
	masters[3].tasks[29] = new UTask(masters[3].consts.tasks[29], true, ice_giants);   //Vannaka
	
	/* Ice Warriors */
	masters[0].tasks[16] = new UTask(masters[0].consts.tasks[16], true, w_ice_warrs);  //Krystilia
	masters[2].tasks[17] = new UTask(masters[2].consts.tasks[17], true, ice_warrs);   //Mazchna
	masters[3].tasks[30] = new UTask(masters[3].consts.tasks[30], true, ice_warrs);   //Vannaka
	
	/* Icefiends */
	masters[1].tasks[14] = new UTask(masters[1].consts.tasks[14], true, icefiends);    //Turael
	
	/* Infernal Mages */
	masters[3].tasks[31] = new UTask(masters[3].consts.tasks[31], true, infernal_mages);   //Vannaka
	masters[4].tasks[26] = new UTask(masters[4].consts.tasks[26], true, infernal_mages);   //Chaeldar
	
	/* Iron Dragons */
	masters[4].tasks[27] = new UTask(masters[4].consts.tasks[27], true, iron_drags);   //Chaeldar
	masters[5].tasks[22] = new UTask(masters[5].consts.tasks[22], true, iron_drags);   //Nieve
	masters[6].tasks[21] = new UTask(masters[6].consts.tasks[21], true, iron_drags);   //Duradel
	
	/* Jellies */
	masters[3].tasks[32] = new UTask(masters[3].consts.tasks[32], true, jellies);   //Vannaka
	masters[4].tasks[28] = new UTask(masters[4].consts.tasks[28], true, jellies);   //Chaeldar
	
	/* Jungle Horrors */
	masters[3].tasks[33] = new UTask(masters[3].consts.tasks[33], true, jungle_horrs);   //Vannaka
	masters[4].tasks[29] = new UTask(masters[4].consts.tasks[29], true, jungle_horrs);   //Chaeldar
	
	/* Kalphites */
	masters[1].tasks[15] = new UTask(masters[1].consts.tasks[15], true, kalphites);   //Turael
	masters[2].tasks[18] = new UTask(masters[2].consts.tasks[18], true, kalphites);   //Mazchna
	masters[3].tasks[34] = new UTask(masters[3].consts.tasks[34], true, kalphites);   //Vannaka
	masters[4].tasks[30] = new UTask(masters[4].consts.tasks[30], true, kalphites);   //Chaeldar
	masters[5].tasks[23] = new UTask(masters[5].consts.tasks[23], true, kalphites);   //Nieve
	masters[6].tasks[22] = new UTask(masters[6].consts.tasks[22], true, kalphites);   //Duradel
	
	/* Killerwatts */
	masters[2].tasks[19] = new UTask(masters[2].consts.tasks[19], true, killerwatts);   //Mazchna
	masters[3].tasks[35] = new UTask(masters[3].consts.tasks[35], true, killerwatts);   //Vannaka
	
	/* Kurasks */
	masters[3].tasks[36] = new UTask(masters[3].consts.tasks[36], true, kurasks);   //Vannaka
	masters[4].tasks[31] = new UTask(masters[4].consts.tasks[31], true, kurasks);   //Chaeldar
	masters[5].tasks[24] = new UTask(masters[5].consts.tasks[24], true, kurasks);   //Nieve
	masters[6].tasks[23] = new UTask(masters[6].consts.tasks[23], true, kurasks);   //Duradel
	
	/* Lava Dragons */
	masters[0].tasks[17] = new UTask(masters[0].consts.tasks[17], true, w_lava_drags);  //Krystilia
	
	/* Lesser Demons */
	masters[0].tasks[18] = new UTask(masters[0].consts.tasks[18], true, w_less_dems);  //Krystilia
	masters[3].tasks[37] = new UTask(masters[3].consts.tasks[37], true, less_dems);   //Vannaka
	masters[4].tasks[32] = new UTask(masters[4].consts.tasks[32], true, less_dems);   //Chaeldar
	
	/* Lizardmen */
	masters[4].tasks[33] = new UTask(masters[4].consts.tasks[33], true, lizardmen);   //Chaeldar
	masters[5].tasks[25] = new UTask(masters[5].consts.tasks[25], true, lizardmen);   //Nieve
	masters[6].tasks[24] = new UTask(masters[6].consts.tasks[24], true, lizardmen);   //Duradel
	
	/* Magic Axes */
	masters[0].tasks[19] = new UTask(masters[0].consts.tasks[19], true, w_mag_axes);  //Krystilia
	
	/* Mammoths */
	masters[0].tasks[20] = new UTask(masters[0].consts.tasks[20], true, w_mammoths);  //Krystilia
	
	/* Minotaurs */
	masters[1].tasks[16] = new UTask(masters[1].consts.tasks[16], true, minotaurs);    //Turael
	
	/* Mithril Dragons */
	masters[5].tasks[26] = new UTask(masters[5].consts.tasks[26], true, mithril_drags);   //Nieve
	masters[6].tasks[25] = new UTask(masters[6].consts.tasks[25], true, mithril_drags);   //Duradel
	
	/* Mogres */
	masters[2].tasks[20] = new UTask(masters[2].consts.tasks[20], true, mogres);   //Mazchna
	masters[3].tasks[39] = new UTask(masters[3].consts.tasks[39], true, mogres);   //Vannaka
	masters[4].tasks[34] = new UTask(masters[4].consts.tasks[34], true, mogres);   //Chaeldar
	
	/* Molanisks */
	masters[3].tasks[40] = new UTask(masters[3].consts.tasks[40], true, molanisks);   //Vannaka
	masters[4].tasks[35] = new UTask(masters[4].consts.tasks[35], true, molanisks);   //Chaeldar
	
	/* Monkeys */
	masters[1].tasks[17] = new UTask(masters[1].consts.tasks[17], true, monkeys);    //Turael
	
	/* Moss Giants */
	masters[3].tasks[41] = new UTask(masters[3].consts.tasks[41], true, moss_giants);   //Vannaka
	
	/* Mutated Zygomites */
	masters[4].tasks[36] = new UTask(masters[4].consts.tasks[36], true, mutated_zygs);   //Chaeldar
	masters[5].tasks[27] = new UTask(masters[5].consts.tasks[27], true, mutated_zygs);   //Nieve
	masters[6].tasks[26] = new UTask(masters[6].consts.tasks[26], true, mutated_zygs);   //Duradel
	
	/* Nechryael */
	masters[3].tasks[42] = new UTask(masters[3].consts.tasks[42], true, nechryael);   //Vannaka
	masters[4].tasks[37] = new UTask(masters[4].consts.tasks[37], true, nechryael);   //Chaeldar
	masters[5].tasks[28] = new UTask(masters[5].consts.tasks[28], true, nechryael);   //Nieve
	masters[6].tasks[27] = new UTask(masters[6].consts.tasks[27], true, nechryael);   //Duradel
	
	/* Ogres */
	masters[3].tasks[43] = new UTask(masters[3].consts.tasks[43], true, ogres);   //Vannaka
	
	/* Otherworldly Beings */
	masters[3].tasks[44] = new UTask(masters[3].consts.tasks[44], true, otherworldly_beings);   //Vannaka
	
	/* Pyrefiends */
	masters[2].tasks[21] = new UTask(masters[2].consts.tasks[21], true, pyrefiends);   //Mazchna
	masters[3].tasks[45] = new UTask(masters[3].consts.tasks[45], true, pyrefiends);   //Vannaka
	masters[4].tasks[38] = new UTask(masters[4].consts.tasks[38], true, pyrefiends);   //Chaeldar
	
	/* Rats */
	masters[1].tasks[18] = new UTask(masters[1].consts.tasks[18], true, rats);    //Turael
	
	/* Red Dragons */
	masters[5].tasks[29] = new UTask(masters[5].consts.tasks[29], true, red_drags);   //Nieve
	masters[6].tasks[28] = new UTask(masters[6].consts.tasks[28], true, red_drags);   //Duradel
	
	/* Revenants */
	masters[0].tasks[21] = new UTask(masters[0].consts.tasks[21], true, w_revenants);  //Krystilia
	
	/* Rockslugs */
	masters[2].tasks[22] = new UTask(masters[2].consts.tasks[22], true, rockslugs);   //Mazchna
	masters[3].tasks[46] = new UTask(masters[3].consts.tasks[46], true, rockslugs);   //Vannaka
	masters[4].tasks[39] = new UTask(masters[4].consts.tasks[39], true, rockslugs);   //Chaeldar
	
	/* Rogues */
	masters[0].tasks[22] = new UTask(masters[0].consts.tasks[22], true, w_rogues);  //Krystilia
	
	/* Rune Dragons */
	masters[5].tasks[30] = new UTask(masters[5].consts.tasks[30], true, rune_drags);   //Nieve
	masters[6].tasks[29] = new UTask(masters[6].consts.tasks[29], true, rune_drags);   //Duradel
	
	/* Scabarites */
	masters[5].tasks[31] = new UTask(masters[5].consts.tasks[31], true, scabarites);   //Nieve
	
	/* Scorpions */
	masters[0].tasks[23] = new UTask(masters[0].consts.tasks[23], true, w_scorpions);   //Krystilia
	masters[1].tasks[19] = new UTask(masters[1].consts.tasks[19], true, scorpions);    //Turael
	masters[2].tasks[23] = new UTask(masters[2].consts.tasks[23], true, scorpions);    //Mazchna
	
	/* Sea Snakes */
	masters[3].tasks[47] = new UTask(masters[3].consts.tasks[47], true, sea_snakes);   //Vannaka
	
	/* Shades */
	masters[2].tasks[24] = new UTask(masters[2].consts.tasks[24], true, shades);   //Mazchna
	masters[3].tasks[38] = new UTask(masters[3].consts.tasks[38], true, shades);   //Vannaka
	
	/* Shadow Warriors */
	masters[3].tasks[48] = new UTask(masters[3].consts.tasks[48], true, shadow_warrs);   //Vannaka
	masters[4].tasks[40] = new UTask(masters[4].consts.tasks[40], true, shadow_warrs);   //Chaeldar
	
	/* Skeletal Wyverns */
	masters[4].tasks[41] = new UTask(masters[4].consts.tasks[41], true, skeletal_wyvs);   //Chaeldar
	masters[5].tasks[32] = new UTask(masters[5].consts.tasks[32], true, skeletal_wyvs);   //Nieve
	masters[6].tasks[30] = new UTask(masters[6].consts.tasks[30], true, skeletal_wyvs);   //Duradel
	
	/* Skeletons */
	masters[0].tasks[24] = new UTask(masters[0].consts.tasks[24], true, w_skeletons);  //Krystilia
	masters[1].tasks[20] = new UTask(masters[1].consts.tasks[20], true, skeletons);   //Turael
	masters[2].tasks[25] = new UTask(masters[2].consts.tasks[25], true, skeletons);   //Mazchna
	
	/* Smoke Devils */
	masters[5].tasks[33] = new UTask(masters[5].consts.tasks[33], true, smoke_devils);   //Nieve
	masters[6].tasks[31] = new UTask(masters[6].consts.tasks[31], true, smoke_devils);   //Duradel
	
	/* Spiders */
	masters[0].tasks[25] = new UTask(masters[0].consts.tasks[25], true, w_spiders);   //Krystilia
	masters[1].tasks[21] = new UTask(masters[1].consts.tasks[21], true, spiders);    //Turael
	
	/* Spiritual Creatures */
	masters[0].tasks[26] = new UTask(masters[0].consts.tasks[26], true, w_spirituals);  //Krystilia
	masters[3].tasks[49] = new UTask(masters[3].consts.tasks[49], true, spirituals);   //Vannaka
	masters[4].tasks[42] = new UTask(masters[4].consts.tasks[42], true, spirituals);   //Chaeldar
	masters[5].tasks[34] = new UTask(masters[5].consts.tasks[34], true, spirituals);   //Nieve
	masters[6].tasks[32] = new UTask(masters[6].consts.tasks[32], true, spirituals);   //Duradel
	
	/* Steel Dragons */
	masters[4].tasks[43] = new UTask(masters[4].consts.tasks[43], true, steel_drags);   //Chaeldar
	masters[5].tasks[35] = new UTask(masters[5].consts.tasks[35], true, steel_drags);   //Nieve
	masters[6].tasks[33] = new UTask(masters[6].consts.tasks[33], true, steel_drags);   //Duradel
	
	/* Suqahs */
	masters[5].tasks[36] = new UTask(masters[5].consts.tasks[36], true, suqahs);   //Nieve
	masters[6].tasks[34] = new UTask(masters[6].consts.tasks[34], true, suqahs);   //Duradel
	
	/* Terror Dogs */
	masters[3].tasks[50] = new UTask(masters[3].consts.tasks[50], true, terror_dogs);   //Vannaka
	
	/* Trolls */
	masters[3].tasks[51] = new UTask(masters[3].consts.tasks[51], true, trolls);   //Vannaka
	masters[4].tasks[44] = new UTask(masters[4].consts.tasks[44], true, trolls);   //Chaeldar
	masters[5].tasks[37] = new UTask(masters[5].consts.tasks[37], true, trolls);   //Nieve
	masters[6].tasks[35] = new UTask(masters[6].consts.tasks[35], true, trolls);   //Duradel
	
	/* Turoth */
	masters[3].tasks[52] = new UTask(masters[3].consts.tasks[52], true, turoth);   //Vannaka
	masters[4].tasks[45] = new UTask(masters[4].consts.tasks[45], true, turoth);   //Chaeldar
	masters[5].tasks[38] = new UTask(masters[5].consts.tasks[38], true, turoth);   //Nieve
	
	/* TzHaar */
	masters[4].tasks[46] = new UTask(masters[4].consts.tasks[46], true, tzhaar);   //Chaeldar
	masters[5].tasks[39] = new UTask(masters[5].consts.tasks[39], true, tzhaar);   //Nieve
	masters[6].tasks[36] = new UTask(masters[6].consts.tasks[36], true, tzhaar);   //Duradel
	
	/* Vampyres */
	masters[2].tasks[26] = new UTask(masters[2].consts.tasks[26], true, vampyres);   //Mazchna
	masters[3].tasks[53] = new UTask(masters[3].consts.tasks[53], true, vampyres);   //Vannaka
	
	/* Wall Beasts */
	masters[2].tasks[27] = new UTask(masters[2].consts.tasks[27], true, wall_beasts);   //Mazchna
	masters[3].tasks[54] = new UTask(masters[3].consts.tasks[54], true, wall_beasts);   //Vannaka
	masters[4].tasks[47] = new UTask(masters[4].consts.tasks[47], true, wall_beasts);   //Chaeldar
	
	/* Waterfiends */
	masters[6].tasks[37] = new UTask(masters[6].consts.tasks[37], true, waterfiends);   //Duradel
	
	/* Werewolves */
	masters[3].tasks[55] = new UTask(masters[3].consts.tasks[55], true, werewolves);   //Vannaka
	
	/* Wolves */
	masters[1].tasks[22] = new UTask(masters[1].consts.tasks[22], true, wolves);   //Turael
	masters[2].tasks[28] = new UTask(masters[2].consts.tasks[28], true, wolves);   //Mazchna
	
	/* Zombies */
	masters[1].tasks[23] = new UTask(masters[1].consts.tasks[23], true, zombies);   //Turael
	masters[2].tasks[29] = new UTask(masters[2].consts.tasks[29], true, zombies);   //Mazchna

	/* Prepares the output. */
	rv = "<br />Scale: " + scale + "<br />";
	rv += "<br />~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" +
			"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" +
			"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~<br />";
	
	/* For each enabled master, add its optimal solution to the return value. */
	for (i = 0; i < num_masters; i++) {
		if (masters[i].enable) {
			masters[i].tasks.sort(sortPref);
			solve(masters[i]);
			rv += optimal_repr(masters[i]);
			rv += "<br />~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" +
				"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" +
				"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~<br />";
		}
	}
	
	return rv;
}
