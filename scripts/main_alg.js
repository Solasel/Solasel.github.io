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
			while (i < all && (!poss[i] || blocks[i])) { i++; }
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
	rv += cmb_app ? "<br />Enable Combat-level appropriate tasks.<br />" :
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
		if (sol.borderline < all) {
			rv += "<br />In addition, you can skip " + sol.skip_perc.toFixed(2) + "% of your " +
				tasks[sol.borderline].consts.name + " tasks.<br />";
		}
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
	100 * (1 - j / (scale * tasks[k].consts.weight));

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
			poss[i] = poss[i] && cmb_lvl >= tasks[i].consts.cmb_rec;
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

		verb = user_in.verb.checked,

		/* Player Details */
		slayer = parseFloat(user_in.s_lvl.value),
		cmb = parseFloat(user_in.cmb_lvl.value),
		blocks = parseFloat(user_in.num_blocks.value),

		/* Slayer Master Info */
		k_enable = user_in.k_en.checked,
		t_enable = user_in.t_en.checked,
		m_enable = user_in.m_en.checked,
		v_enable = user_in.v_en.checked,
		c_enable = user_in.c_en.checked,
		n_enable = user_in.n_en.checked,
		d_enable = user_in.d_en.checked,

		wpelite = user_in.wpelite.checked,

		/* Task Data */

		ab_spectres_po = user_in.ab_spectres_po.checked,
		ab_spectres_pr = parseFloat(verb ? user_in.ab_spectres_pr_l.value : user_in.ab_spectres_pr_r.value),

		abyssal_dems_po = user_in.abyssal_dems_po.checked,
		abyssal_dems_pr = parseFloat(verb ? user_in.abyssal_dems_pr_l.value : user_in.abyssal_dems_pr_r.value),

		adamant_drags_po = user_in.adamant_drags_po.checked,
		adamant_drags_pr = parseFloat(verb ? user_in.adamant_drags_pr_l.value : user_in.adamant_drags_pr_r.value),

		ankou_po = user_in.ankou_po.checked,
		ankou_pr = parseFloat(verb ? user_in.ankou_pr_l.value : user_in.ankou_pr_r.value),

		aviansies_po = user_in.aviansies_po.checked,
		aviansies_pr = parseFloat(verb ? user_in.aviansies_pr_l.value : user_in.aviansies_pr_r.value),

		banshees_po = user_in.banshees_po.checked,
		banshees_pr = parseFloat(verb ? user_in.banshees_pr_l.value : user_in.banshees_pr_r.value),

		basilisks_po = user_in.basilisks_po.checked,
		basilisks_pr = parseFloat(verb ? user_in.basilisks_pr_l.value : user_in.basilisks_pr_r.value),

		bats_po = user_in.bats_po.checked,
		bats_pr = parseFloat(verb ? user_in.bats_pr_l.value : user_in.bats_pr_r.value),

		bears_po = user_in.bears_po.checked,
		bears_pr = parseFloat(verb ? user_in.bears_pr_l.value : user_in.bears_pr_r.value),

		birds_po = user_in.birds_po.checked,
		birds_pr = parseFloat(verb ? user_in.birds_pr_l.value : user_in.birds_pr_r.value),

		black_dems_po = user_in.black_dems_po.checked,
		black_dems_pr = parseFloat(verb ? user_in.black_dems_pr_l.value : user_in.black_dems_pr_r.value),

		black_drags_po = user_in.black_drags_po.checked,
		black_drags_pr = parseFloat(verb ? user_in.black_drags_pr_l.value : user_in.black_drags_pr_r.value),

		bloodveld_po = user_in.bloodveld_po.checked,
		bloodveld_pr = parseFloat(verb ? user_in.bloodveld_pr_l.value : user_in.bloodveld_pr_r.value),

		blue_drags_po = user_in.blue_drags_po.checked,
		blue_drags_pr = parseFloat(verb ? user_in.blue_drags_pr_l.value : user_in.blue_drags_pr_r.value),

		bosses_po = user_in.bosses_po.checked,
		bosses_pr = parseFloat(verb ? user_in.bosses_pr_l.value : user_in.bosses_pr_r.value),

		brine_rats_po = user_in.brine_rats_po.checked,
		brine_rats_pr = parseFloat(verb ? user_in.brine_rats_pr_l.value : user_in.brine_rats_pr_r.value),

		bronze_drags_po = user_in.bronze_drags_po.checked,
		bronze_drags_pr = parseFloat(verb ? user_in.bronze_drags_pr_l.value : user_in.bronze_drags_pr_r.value),

		catablepons_po = user_in.catablepons_po.checked,
		catablepons_pr = parseFloat(verb ? user_in.catablepons_pr_l.value : user_in.catablepons_pr_r.value),

		cave_bugs_po = user_in.cave_bugs_po.checked,
		cave_bugs_pr = parseFloat(verb ? user_in.cave_bugs_pr_l.value : user_in.cave_bugs_pr_r.value),

		cave_crawlers_po = user_in.cave_crawlers_po.checked,
		cave_crawlers_pr = parseFloat(verb ? user_in.cave_crawlers_pr_l.value : user_in.cave_crawlers_pr_r.value),

		cave_horrors_po = user_in.cave_horrors_po.checked,
		cave_horrors_pr = parseFloat(verb ? user_in.cave_horrors_pr_l.value : user_in.cave_horrors_pr_r.value),

		cave_kraken_po = user_in.cave_kraken_po.checked,
		cave_kraken_pr = parseFloat(verb ? user_in.cave_kraken_pr_l.value : user_in.cave_kraken_pr_r.value),

		cave_slimes_po = user_in.cave_slimes_po.checked,
		cave_slimes_pr = parseFloat(verb ? user_in.cave_slimes_pr_l.value : user_in.cave_slimes_pr_r.value),

		cockatrice_po = user_in.cockatrice_po.checked,
		cockatrice_pr = parseFloat(verb ? user_in.cockatrice_pr_l.value : user_in.cockatrice_pr_r.value),

		cows_po = user_in.cows_po.checked,
		cows_pr = parseFloat(verb ? user_in.cows_pr_l.value : user_in.cows_pr_r.value),

		crawling_hands_po = user_in.crawling_hands_po.checked,
		crawling_hands_pr = parseFloat(verb ? user_in.crawling_hands_pr_l.value : user_in.crawling_hands_pr_r.value),

		crocodiles_po = user_in.crocodiles_po.checked,
		crocodiles_pr = parseFloat(verb ? user_in.crocodiles_pr_l.value : user_in.crocodiles_pr_r.value),

		dagannoth_po = user_in.dagannoth_po.checked,
		dagannoth_pr = parseFloat(verb ? user_in.dagannoth_pr_l.value : user_in.dagannoth_pr_r.value),

		dark_beasts_po = user_in.dark_beasts_po.checked,
		dark_beasts_pr = parseFloat(verb ? user_in.dark_beasts_pr_l.value : user_in.dark_beasts_pr_r.value),

		desert_liz_po = user_in.desert_liz_po.checked,
		desert_liz_pr = parseFloat(verb ? user_in.desert_liz_pr_l.value : user_in.desert_liz_pr_r.value),

		dogs_po = user_in.dogs_po.checked,
		dogs_pr = parseFloat(verb ? user_in.dogs_pr_l.value : user_in.dogs_pr_r.value),

		dust_devils_po = user_in.dust_devils_po.checked,
		dust_devils_pr = parseFloat(verb ? user_in.dust_devils_pr_l.value : user_in.dust_devils_pr_r.value),

		dwarves_po = user_in.dwarves_po.checked,
		dwarves_pr = parseFloat(verb ? user_in.dwarves_pr_l.value : user_in.dwarves_pr_r.value),

		earth_warrs_po = user_in.earth_warrs_po.checked,
		earth_warrs_pr = parseFloat(verb ? user_in.earth_warrs_pr_l.value : user_in.earth_warrs_pr_r.value),

		elves_po = user_in.elves_po.checked,
		elves_pr = parseFloat(verb ? user_in.elves_pr_l.value : user_in.elves_pr_r.value),

		fever_spiders_po = user_in.fever_spiders_po.checked,
		fever_spiders_pr = parseFloat(verb ? user_in.fever_spiders_pr_l.value : user_in.fever_spiders_pr_r.value),

		fire_giants_po = user_in.fire_giants_po.checked,
		fire_giants_pr = parseFloat(verb ? user_in.fire_giants_pr_l.value : user_in.fire_giants_pr_r.value),

		flesh_crawlers_po = user_in.flesh_crawlers_po.checked,
		flesh_crawlers_pr = parseFloat(verb ? user_in.flesh_crawlers_pr_l.value : user_in.flesh_crawlers_pr_r.value),

		fossil_wyvs_po = user_in.fossil_wyvs_po.checked,
		fossil_wyvs_pr = parseFloat(verb ? user_in.fossil_wyvs_pr_l.value : user_in.fossil_wyvs_pr_r.value),

		gargoyles_po = user_in.gargoyles_po.checked,
		gargoyles_pr = parseFloat(verb ? user_in.gargoyles_pr_l.value : user_in.gargoyles_pr_r.value),

		ghosts_po = user_in.ghosts_po.checked,
		ghosts_pr = parseFloat(verb ? user_in.ghosts_pr_l.value : user_in.ghosts_pr_r.value),

		ghouls_po = user_in.ghouls_po.checked,
		ghouls_pr = parseFloat(verb ? user_in.ghouls_pr_l.value : user_in.ghouls_pr_r.value),

		goblins_po = user_in.goblins_po.checked,
		goblins_pr = parseFloat(verb ? user_in.goblins_pr_l.value : user_in.goblins_pr_r.value),

		great_dems_po = user_in.great_dems_po.checked,
		great_dems_pr = parseFloat(verb ? user_in.great_dems_pr_l.value : user_in.great_dems_pr_r.value),

		green_drags_po = user_in.green_drags_po.checked,
		green_drags_pr = parseFloat(verb ? user_in.green_drags_pr_l.value : user_in.green_drags_pr_r.value),

		harpie_bugs_po = user_in.harpie_bugs_po.checked,
		harpie_bugs_pr = parseFloat(verb ? user_in.harpie_bugs_pr_l.value : user_in.harpie_bugs_pr_r.value),

		hellhounds_po = user_in.hellhounds_po.checked,
		hellhounds_pr = parseFloat(verb ? user_in.hellhounds_pr_l.value : user_in.hellhounds_pr_r.value),

		hill_giants_po = user_in.hill_giants_po.checked,
		hill_giants_pr = parseFloat(verb ? user_in.hill_giants_pr_l.value : user_in.hill_giants_pr_r.value),

		hobgoblins_po = user_in.hobgoblins_po.checked,
		hobgoblins_pr = parseFloat(verb ? user_in.hobgoblins_pr_l.value : user_in.hobgoblins_pr_r.value),

		ice_giants_po = user_in.ice_giants_po.checked,
		ice_giants_pr = parseFloat(verb ? user_in.ice_giants_pr_l.value : user_in.ice_giants_pr_r.value),

		ice_warrs_po = user_in.ice_warrs_po.checked,
		ice_warrs_pr = parseFloat(verb ? user_in.ice_warrs_pr_l.value : user_in.ice_warrs_pr_r.value),

		icefiends_po = user_in.icefiends_po.checked,
		icefiends_pr = parseFloat(verb ? user_in.icefiends_pr_l.value : user_in.icefiends_pr_r.value),

		infernal_mages_po = user_in.infernal_mages_po.checked,
		infernal_mages_pr = parseFloat(verb ? user_in.infernal_mages_pr_l.value : user_in.infernal_mages_pr_r.value),

		iron_drags_po = user_in.iron_drags_po.checked,
		iron_drags_pr = parseFloat(verb ? user_in.iron_drags_pr_l.value : user_in.iron_drags_pr_r.value),

		jellies_po = user_in.jellies_po.checked,
		jellies_pr = parseFloat(verb ? user_in.jellies_pr_l.value : user_in.jellies_pr_r.value),

		jungle_horrs_po = user_in.jungle_horrs_po.checked,
		jungle_horrs_pr = parseFloat(verb ? user_in.jungle_horrs_pr_l.value : user_in.jungle_horrs_pr_r.value),

		kalphites_po = user_in.kalphites_po.checked,
		kalphites_pr = parseFloat(verb ? user_in.kalphites_pr_l.value : user_in.kalphites_pr_r.value),

		killerwatts_po = user_in.killerwatts_po.checked,
		killerwatts_pr = parseFloat(verb ? user_in.killerwatts_pr_l.value : user_in.killerwatts_pr_r.value),

		kurasks_po = user_in.kurasks_po.checked,
		kurasks_pr = parseFloat(verb ? user_in.kurasks_pr_l.value : user_in.kurasks_pr_r.value),

		less_dems_po = user_in.less_dems_po.checked,
		less_dems_pr = parseFloat(verb ? user_in.less_dems_pr_l.value : user_in.less_dems_pr_r.value),

		lizardmen_po = user_in.lizardmen_po.checked,
		lizardmen_pr = parseFloat(verb ? user_in.lizardmen_pr_l.value : user_in.lizardmen_pr_r.value),

		minotaurs_po = user_in.minotaurs_po.checked,
		minotaurs_pr = parseFloat(verb ? user_in.minotaurs_pr_l.value : user_in.minotaurs_pr_r.value),

		mithril_drags_po = user_in.mithril_drags_po.checked,
		mithril_drags_pr = parseFloat(verb ? user_in.mithril_drags_pr_l.value : user_in.mithril_drags_pr_r.value),

		mogres_po = user_in.mogres_po.checked,
		mogres_pr = parseFloat(verb ? user_in.mogres_pr_l.value : user_in.mogres_pr_r.value),

		molanisks_po = user_in.molanisks_po.checked,
		molanisks_pr = parseFloat(verb ? user_in.molanisks_pr_l.value : user_in.molanisks_pr_r.value),

		monkeys_po = user_in.monkeys_po.checked,
		monkeys_pr = parseFloat(verb ? user_in.monkeys_pr_l.value : user_in.monkeys_pr_r.value),

		moss_giants_po = user_in.moss_giants_po.checked,
		moss_giants_pr = parseFloat(verb ? user_in.moss_giants_pr_l.value : user_in.moss_giants_pr_r.value),

		mutated_zygs_po = user_in.mutated_zygs_po.checked,
		mutated_zygs_pr = parseFloat(verb ? user_in.mutated_zygs_pr_l.value : user_in.mutated_zygs_pr_r.value),

		nechryael_po = user_in.nechryael_po.checked,
		nechryael_pr = parseFloat(verb ? user_in.nechryael_pr_l.value : user_in.nechryael_pr_r.value),

		ogres_po = user_in.ogres_po.checked,
		ogres_pr = parseFloat(verb ? user_in.ogres_pr_l.value : user_in.ogres_pr_r.value),

		otherworldly_beings_po = user_in.otherworldly_beings_po.checked,
		otherworldly_beings_pr = parseFloat(verb ? user_in.otherworldly_beings_pr_l.value : user_in.otherworldly_beings_pr_r.value),

		pyrefiends_po = user_in.pyrefiends_po.checked,
		pyrefiends_pr = parseFloat(verb ? user_in.pyrefiends_pr_l.value : user_in.pyrefiends_pr_r.value),

		rats_po = user_in.rats_po.checked,
		rats_pr = parseFloat(verb ? user_in.rats_pr_l.value : user_in.rats_pr_r.value),

		red_drags_po = user_in.red_drags_po.checked,
		red_drags_pr = parseFloat(verb ? user_in.red_drags_pr_l.value : user_in.red_drags_pr_r.value),

		rockslugs_po = user_in.rockslugs_po.checked,
		rockslugs_pr = parseFloat(verb ? user_in.rockslugs_pr_l.value : user_in.rockslugs_pr_r.value),

		rune_drags_po = user_in.rune_drags_po.checked,
		rune_drags_pr = parseFloat(verb ? user_in.rune_drags_pr_l.value : user_in.rune_drags_pr_r.value),

		scabarites_po = user_in.scabarites_po.checked,
		scabarites_pr = parseFloat(verb ? user_in.scabarites_pr_l.value : user_in.scabarites_pr_r.value),

		scorpions_po = user_in.scorpions_po.checked,
		scorpions_pr = parseFloat(verb ? user_in.scorpions_pr_l.value : user_in.scorpions_pr_r.value),

		sea_snakes_po = user_in.sea_snakes_po.checked,
		sea_snakes_pr = parseFloat(verb ? user_in.sea_snakes_pr_l.value : user_in.sea_snakes_pr_r.value),

		shades_po = user_in.shades_po.checked,
		shades_pr = parseFloat(verb ? user_in.shades_pr_l.value : user_in.shades_pr_r.value),

		shadow_warrs_po = user_in.shadow_warrs_po.checked,
		shadow_warrs_pr = parseFloat(verb ? user_in.shadow_warrs_pr_l.value : user_in.shadow_warrs_pr_r.value),

		skeletal_wyvs_po = user_in.skeletal_wyvs_po.checked,
		skeletal_wyvs_pr = parseFloat(verb ? user_in.skeletal_wyvs_pr_l.value : user_in.skeletal_wyvs_pr_r.value),

		skeletons_po = user_in.skeletons_po.checked,
		skeletons_pr = parseFloat(verb ? user_in.skeletons_pr_l.value : user_in.skeletons_pr_r.value),

		smoke_devils_po = user_in.smoke_devils_po.checked,
		smoke_devils_pr = parseFloat(verb ? user_in.smoke_devils_pr_l.value : user_in.smoke_devils_pr_r.value),

		spiders_po = user_in.spiders_po.checked,
		spiders_pr = parseFloat(verb ? user_in.spiders_pr_l.value : user_in.spiders_pr_r.value),

		spirituals_po = user_in.spirituals_po.checked,
		spirituals_pr = parseFloat(verb ? user_in.spirituals_pr_l.value : user_in.spirituals_pr_r.value),

		steel_drags_po = user_in.steel_drags_po.checked,
		steel_drags_pr = parseFloat(verb ? user_in.steel_drags_pr_l.value : user_in.steel_drags_pr_r.value),

		suqahs_po = user_in.suqahs_po.checked,
		suqahs_pr = parseFloat(verb ? user_in.suqahs_pr_l.value : user_in.suqahs_pr_r.value),

		terror_dogs_po = user_in.terror_dogs_po.checked,
		terror_dogs_pr = parseFloat(verb ? user_in.terror_dogs_pr_l.value : user_in.terror_dogs_pr_r.value),

		trolls_po = user_in.trolls_po.checked,
		trolls_pr = parseFloat(verb ? user_in.trolls_pr_l.value : user_in.trolls_pr_r.value),

		turoth_po = user_in.turoth_po.checked,
		turoth_pr = parseFloat(verb ? user_in.turoth_pr_l.value : user_in.turoth_pr_r.value),

		tzhaar_po = user_in.tzhaar_po.checked,
		tzhaar_pr = parseFloat(verb ? user_in.tzhaar_pr_l.value : user_in.tzhaar_pr_r.value),

		vampyres_po = user_in.vampyres_po.checked,
		vampyres_pr = parseFloat(verb ? user_in.vampyres_pr_l.value : user_in.vampyres_pr_r.value),

		wall_beasts_po = user_in.wall_beasts_po.checked,
		wall_beasts_pr = parseFloat(verb ? user_in.wall_beasts_pr_l.value : user_in.wall_beasts_pr_r.value),

		waterfiends_po = user_in.waterfiends_po.checked,
		waterfiends_pr = parseFloat(verb ? user_in.waterfiends_pr_l.value : user_in.waterfiends_pr_r.value),

		werewolves_po = user_in.werewolves_po.checked,
		werewolves_pr = parseFloat(verb ? user_in.werewolves_pr_l.value : user_in.werewolves_pr_r.value),

		wolves_po = user_in.wolves_po.checked,
		wolves_pr = parseFloat(verb ? user_in.wolves_pr_l.value : user_in.wolves_pr_r.value),

		zombies_po = user_in.zombies_po.checked,
		zombies_pr = parseFloat(verb ? user_in.zombies_pr_l.value : user_in.zombies_pr_r.value),

		w_ankou_po = user_in.w_ankou_po.checked,
		w_ankou_pr = parseFloat(verb ? user_in.w_ankou_pr_l.value : user_in.w_ankou_pr_r.value),

		w_aviansies_po = user_in.w_aviansies_po.checked,
		w_aviansies_pr = parseFloat(verb ? user_in.w_aviansies_pr_l.value : user_in.w_aviansies_pr_r.value),

		w_bandits_po = user_in.w_bandits_po.checked,
		w_bandits_pr = parseFloat(verb ? user_in.w_bandits_pr_l.value : user_in.w_bandits_pr_r.value),

		w_bears_po = user_in.w_bears_po.checked,
		w_bears_pr = parseFloat(verb ? user_in.w_bears_pr_l.value : user_in.w_bears_pr_r.value),

		w_black_dems_po = user_in.w_black_dems_po.checked,
		w_black_dems_pr = parseFloat(verb ? user_in.w_black_dems_pr_l.value : user_in.w_black_dems_pr_r.value),

		w_black_drags_po = user_in.w_black_drags_po.checked,
		w_black_drags_pr = parseFloat(verb ? user_in.w_black_drags_pr_l.value : user_in.w_black_drags_pr_r.value),

		w_bosses_po = user_in.w_bosses_po.checked,
		w_bosses_pr = parseFloat(verb ? user_in.w_bosses_pr_l.value : user_in.w_bosses_pr_r.value),

		w_chaos_druids_po = user_in.w_chaos_druids_po.checked,
		w_chaos_druids_pr = parseFloat(verb ? user_in.w_chaos_druids_pr_l.value : user_in.w_chaos_druids_pr_r.value),

		w_dark_warrs_po = user_in.w_dark_warrs_po.checked,
		w_dark_warrs_pr = parseFloat(verb ? user_in.w_dark_warrs_pr_l.value : user_in.w_dark_warrs_pr_r.value),

		w_earth_warrs_po = user_in.w_earth_warrs_po.checked,
		w_earth_warrs_pr = parseFloat(verb ? user_in.w_earth_warrs_pr_l.value : user_in.w_earth_warrs_pr_r.value),

		w_ents_po = user_in.w_ents_po.checked,
		w_ents_pr = parseFloat(verb ? user_in.w_ents_pr_l.value : user_in.w_ents_pr_r.value),

		w_fire_giants_po = user_in.w_fire_giants_po.checked,
		w_fire_giants_pr = parseFloat(verb ? user_in.w_fire_giants_pr_l.value : user_in.w_fire_giants_pr_r.value),

		w_great_dems_po = user_in.w_great_dems_po.checked,
		w_great_dems_pr = parseFloat(verb ? user_in.w_great_dems_pr_l.value : user_in.w_great_dems_pr_r.value),

		w_green_drags_po = user_in.w_green_drags_po.checked,
		w_green_drags_pr = parseFloat(verb ? user_in.w_green_drags_pr_l.value : user_in.w_green_drags_pr_r.value),

		w_hellhounds_po = user_in.w_hellhounds_po.checked,
		w_hellhounds_pr = parseFloat(verb ? user_in.w_hellhounds_pr_l.value : user_in.w_hellhounds_pr_r.value),

		w_ice_giants_po = user_in.w_ice_giants_po.checked,
		w_ice_giants_pr = parseFloat(verb ? user_in.w_ice_giants_pr_l.value : user_in.w_ice_giants_pr_r.value),

		w_ice_warrs_po = user_in.w_ice_warrs_po.checked,
		w_ice_warrs_pr = parseFloat(verb ? user_in.w_ice_warrs_pr_l.value : user_in.w_ice_warrs_pr_r.value),

		w_lava_drags_po = user_in.w_lava_drags_po.checked,
		w_lava_drags_pr = parseFloat(verb ? user_in.w_lava_drags_pr_l.value : user_in.w_lava_drags_pr_r.value),

		w_less_dems_po = user_in.w_less_dems_po.checked,
		w_less_dems_pr = parseFloat(verb ? user_in.w_less_dems_pr_l.value : user_in.w_less_dems_pr_r.value),

		w_mag_axes_po = user_in.w_mag_axes_po.checked,
		w_mag_axes_pr = parseFloat(verb ? user_in.w_mag_axes_pr_l.value : user_in.w_mag_axes_pr_r.value),

		w_mammoths_po = user_in.w_mammoths_po.checked,
		w_mammoths_pr = parseFloat(verb ? user_in.w_mammoths_pr_l.value : user_in.w_mammoths_pr_r.value),

		w_revenants_po = user_in.w_revenants_po.checked,
		w_revenants_pr = parseFloat(verb ? user_in.w_revenants_pr_l.value : user_in.w_revenants_pr_r.value),

		w_rogues_po = user_in.w_rogues_po.checked,
		w_rogues_pr = parseFloat(verb ? user_in.w_rogues_pr_l.value : user_in.w_rogues_pr_r.value),

		w_scorpions_po = user_in.w_scorpions_po.checked,
		w_scorpions_pr = parseFloat(verb ? user_in.w_scorpions_pr_l.value : user_in.w_scorpions_pr_r.value),

		w_skeletons_po = user_in.w_skeletons_po.checked,
		w_skeletons_pr = parseFloat(verb ? user_in.w_skeletons_pr_l.value : user_in.w_skeletons_pr_r.value),

		w_spiders_po = user_in.w_spiders_po.checked,
		w_spiders_pr = parseFloat(verb ? user_in.w_spiders_pr_l.value : user_in.w_spiders_pr_r.value),

		w_spirituals_po = user_in.w_spirituals_po.checked,
		w_spirituals_pr = parseFloat(verb ? user_in.w_spirituals_pr_l.value : user_in.w_spirituals_pr_r.value),

		wen = user_in.wen.checked;

	/* If the wildy is the same as normal. */
	if (wen) {
		w_bears_pr = bears_pr;
		w_aviansies_pr = aviansies_pr;
		w_ankou_pr = ankou_pr;
		w_black_dems_pr = black_dems_pr;
		w_black_drags_pr = black_drags_pr;
		w_bosses_pr = bosses;
		w_earth_warrs_pr = earth_warrs_pr;
		w_fire_giants_pr = fire_giants_pr;
		w_great_dems_pr = great_dems_pr;
		w_green_drags_pr = green_drags_pr;
		w_hellhounds_pr = hellhounds_pr;
		w_ice_giants_pr = ice_giants_pr;
		w_ice_warrs_pr = ice_warrs_pr;
		w_less_dems_pr = less_dems_pr;
		w_scorpions_pr = scorpions_pr;
		w_skeletons_pr = skeletons_pr;
		w_spiders_pr = spiders_pr;
		w_spirituals_pr = spirituals_pr;
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
	masters[3].tasks[0] = new UTask(masters[3].consts.tasks[0], ab_spectres_po, ab_spectres_pr);    //Vannaka
	masters[4].tasks[0] = new UTask(masters[4].consts.tasks[0], ab_spectres_po, ab_spectres_pr);    //Chaeldar
	masters[5].tasks[0] = new UTask(masters[5].consts.tasks[0], ab_spectres_po, ab_spectres_pr);    //Nieve
	masters[6].tasks[0] = new UTask(masters[6].consts.tasks[0], ab_spectres_po, ab_spectres_pr);    //Duradel

	/* Abyssal Demons */
	masters[3].tasks[1] = new UTask(masters[3].consts.tasks[1], abyssal_dems_po, abyssal_dems_pr);    //Vannaka
	masters[4].tasks[1] = new UTask(masters[4].consts.tasks[1], abyssal_dems_po, abyssal_dems_pr);    //Chaeldar
	masters[5].tasks[1] = new UTask(masters[5].consts.tasks[1], abyssal_dems_po, abyssal_dems_pr);    //Nieve
	masters[6].tasks[1] = new UTask(masters[6].consts.tasks[1], abyssal_dems_po, abyssal_dems_pr);    //Duradel

	/* Adamant Dragons */
	masters[5].tasks[2] = new UTask(masters[5].consts.tasks[2], adamant_drags_po, adamant_drags_pr);    //Nieve
	masters[6].tasks[2] = new UTask(masters[6].consts.tasks[2], adamant_drags_po, adamant_drags_pr);    //Duradel

	/* Ankou */
	masters[0].tasks[0] = new UTask(masters[0].consts.tasks[0], w_ankou_po, w_ankou_pr);  //Krystilia
	masters[3].tasks[2] = new UTask(masters[3].consts.tasks[2], ankou_po, ankou_pr);   //Vannaka
	masters[5].tasks[3] = new UTask(masters[5].consts.tasks[3], ankou_po, ankou_pr);   //Nieve
	masters[6].tasks[3] = new UTask(masters[6].consts.tasks[3], ankou_po, ankou_pr);   //Duradel

	/* Aviansies */
	masters[0].tasks[1] = new UTask(masters[0].consts.tasks[1], w_aviansies_po, w_aviansies_pr);  //Krystilia
	masters[4].tasks[2] = new UTask(masters[4].consts.tasks[2], aviansies_po, aviansies_pr);   //Chaeldar
	masters[5].tasks[4] = new UTask(masters[5].consts.tasks[4], aviansies_po, aviansies_pr);   //Nieve
	masters[6].tasks[4] = new UTask(masters[6].consts.tasks[4], aviansies_po, aviansies_pr);   //Duradel

	/* Bandits */
	masters[0].tasks[2] = new UTask(masters[0].consts.tasks[2], w_bandits_po, w_bandits_pr);   //Krystilia

	/* Banshees */
	masters[1].tasks[0] = new UTask(masters[1].consts.tasks[0], banshees_po, banshees_pr);    //Turael
	masters[2].tasks[0] = new UTask(masters[2].consts.tasks[0], banshees_po, banshees_pr);    //Mazchna
	masters[3].tasks[3] = new UTask(masters[3].consts.tasks[3], banshees_po, banshees_pr);    //Vannaka
	masters[4].tasks[3] = new UTask(masters[4].consts.tasks[3], banshees_po, banshees_pr);    //Chaeldar

	/* Basilisks */
	masters[3].tasks[4] = new UTask(masters[3].consts.tasks[4], basilisks_po, basilisks_pr);    //Vannaka
	masters[4].tasks[4] = new UTask(masters[4].consts.tasks[4], basilisks_po, basilisks_pr);    //Chaeldar

	/* Bats */
	masters[1].tasks[1] = new UTask(masters[1].consts.tasks[1], bats_po, bats_pr);    //Turael
	masters[2].tasks[1] = new UTask(masters[2].consts.tasks[1], bats_po, bats_pr);    //Mazchna

	/* Bears */
	masters[0].tasks[3] = new UTask(masters[0].consts.tasks[3], w_bears_po, w_bears_pr);  //Krystilia
	masters[1].tasks[2] = new UTask(masters[1].consts.tasks[2], bears_po, bears_pr);   //Turael
	masters[2].tasks[2] = new UTask(masters[2].consts.tasks[2], bears_po, bears_pr);   //Mazchna

	/* Birds */
	masters[1].tasks[3] = new UTask(masters[1].consts.tasks[3], birds_po, birds_pr);    //Turael

	/* Black Demons */
	masters[0].tasks[4] = new UTask(masters[0].consts.tasks[4], w_black_dems_po, w_black_dems_pr);   //Krystilia
	masters[4].tasks[5] = new UTask(masters[4].consts.tasks[5], black_dems_po, black_dems_pr);    //Chaeldar
	masters[5].tasks[5] = new UTask(masters[5].consts.tasks[5], black_dems_po, black_dems_pr);    //Nieve
	masters[6].tasks[5] = new UTask(masters[6].consts.tasks[5], black_dems_po, black_dems_pr);    //Duradel

	/* Black Dragons */
	masters[0].tasks[5] = new UTask(masters[0].consts.tasks[5], w_black_drags_po, w_black_drags_pr);   //Krystilia
	masters[5].tasks[6] = new UTask(masters[5].consts.tasks[6], black_drags_po, black_drags_pr);    //Nieve
	masters[6].tasks[6] = new UTask(masters[6].consts.tasks[6], black_drags_po, black_drags_pr);    //Duradel

	/* Bloodveld */
	masters[3].tasks[5] = new UTask(masters[3].consts.tasks[5], bloodveld_po, bloodveld_pr);    //Vannaka
	masters[4].tasks[6] = new UTask(masters[4].consts.tasks[6], bloodveld_po, bloodveld_pr);    //Chaeldar
	masters[5].tasks[7] = new UTask(masters[5].consts.tasks[7], bloodveld_po, bloodveld_pr);    //Nieve
	masters[6].tasks[7] = new UTask(masters[6].consts.tasks[7], bloodveld_po, bloodveld_pr);    //Duradel

	/* Blue Dragons */
	masters[3].tasks[6] = new UTask(masters[3].consts.tasks[6], blue_drags_po, blue_drags_pr);    //Vannaka
	masters[4].tasks[7] = new UTask(masters[4].consts.tasks[7], blue_drags_po, blue_drags_pr);    //Chaeldar
	masters[5].tasks[8] = new UTask(masters[5].consts.tasks[8], blue_drags_po, blue_drags_pr);    //Nieve
	masters[6].tasks[8] = new UTask(masters[6].consts.tasks[8], blue_drags_po, blue_drags_pr);    //Duradel

	/* Bosses */
	masters[0].tasks[6] = new UTask(masters[0].consts.tasks[6], w_bosses_po, w_bosses_pr);   //Krystilia
	masters[5].tasks[9] = new UTask(masters[5].consts.tasks[9], bosses_po, bosses_pr);    //Nieve
	masters[6].tasks[9] = new UTask(masters[6].consts.tasks[9], bosses_po, bosses_pr);    //Duradel

	/* Brine Rats */
	masters[3].tasks[7] = new UTask(masters[3].consts.tasks[7], brine_rats_po, brine_rats_pr);     //Vannaka
	masters[4].tasks[8] = new UTask(masters[4].consts.tasks[8], brine_rats_po, brine_rats_pr);    //Chaeldar
	masters[5].tasks[10] = new UTask(masters[5].consts.tasks[10], brine_rats_po, brine_rats_pr);   //Nieve

	/* Bronze Dragons */
	masters[3].tasks[8] = new UTask(masters[3].consts.tasks[8], bronze_drags_po, bronze_drags_pr);    //Vannaka
	masters[4].tasks[9] = new UTask(masters[4].consts.tasks[9], bronze_drags_po, bronze_drags_pr);    //Chaeldar

	/* Catablepons */
	masters[2].tasks[3] = new UTask(masters[2].consts.tasks[3], catablepons_po, catablepons_pr);   //Mazchna

	/* Cave Bugs */
	masters[1].tasks[4] = new UTask(masters[1].consts.tasks[4], cave_bugs_po, cave_bugs_pr);   //Turael
	masters[2].tasks[4] = new UTask(masters[2].consts.tasks[4], cave_bugs_po, cave_bugs_pr);   //Mazchna
	masters[3].tasks[9] = new UTask(masters[3].consts.tasks[9], cave_bugs_po, cave_bugs_pr);   //Vannaka

	/* Cave Crawlers */
	masters[1].tasks[5] = new UTask(masters[1].consts.tasks[5], cave_crawlers_po, cave_crawlers_pr);     //Turael
	masters[2].tasks[5] = new UTask(masters[2].consts.tasks[5], cave_crawlers_po, cave_crawlers_pr);     //Mazchna
	masters[3].tasks[10] = new UTask(masters[3].consts.tasks[10], cave_crawlers_po, cave_crawlers_pr);   //Vannaka
	masters[4].tasks[10] = new UTask(masters[4].consts.tasks[10], cave_crawlers_po, cave_crawlers_pr);   //Chaeldar

	/* Cave Horrors */
	masters[4].tasks[11] = new UTask(masters[4].consts.tasks[11], cave_horrors_po, cave_horrors_pr);   //Chaeldar
	masters[5].tasks[11] = new UTask(masters[5].consts.tasks[11], cave_horrors_po, cave_horrors_pr);   //Nieve
	masters[6].tasks[10] = new UTask(masters[6].consts.tasks[10], cave_horrors_po, cave_horrors_pr);   //Duradel

	/* Cave Kraken */
	masters[4].tasks[12] = new UTask(masters[4].consts.tasks[12], cave_kraken_po, cave_kraken_pr);   //Chaeldar
	masters[5].tasks[12] = new UTask(masters[5].consts.tasks[12], cave_kraken_po, cave_kraken_pr);   //Nieve
	masters[6].tasks[11] = new UTask(masters[6].consts.tasks[11], cave_kraken_po, cave_kraken_pr);   //Duradel

	/* Cave Slimes */
	masters[1].tasks[6] = new UTask(masters[1].consts.tasks[6], cave_slimes_po, cave_slimes_pr);     //Turael
	masters[2].tasks[6] = new UTask(masters[2].consts.tasks[6], cave_slimes_po, cave_slimes_pr);     //Mazchna
	masters[3].tasks[11] = new UTask(masters[3].consts.tasks[11], cave_slimes_po, cave_slimes_pr);   //Vannaka
	masters[4].tasks[13] = new UTask(masters[4].consts.tasks[13], cave_slimes_po, cave_slimes_pr);   //Chaeldar

	/* Chaos Druids */
	masters[0].tasks[7] = new UTask(masters[0].consts.tasks[7], w_chaos_druids_po, w_chaos_druids_pr);   //Krystilia

	/* Cockatrice */
	masters[2].tasks[7] = new UTask(masters[2].consts.tasks[7], cockatrice_po, cockatrice_pr);     //Mazchna
	masters[3].tasks[12] = new UTask(masters[3].consts.tasks[12], cockatrice_po, cockatrice_pr);   //Vannaka
	masters[4].tasks[14] = new UTask(masters[4].consts.tasks[14], cockatrice_po, cockatrice_pr);   //Chaeldar

	/* Cows */
	masters[1].tasks[7] = new UTask(masters[1].consts.tasks[7], cows_po, cows_pr);    //Turael

	/* Crawling Hands */
	masters[1].tasks[8] = new UTask(masters[1].consts.tasks[8], crawling_hands_po, crawling_hands_pr);     //Turael
	masters[2].tasks[8] = new UTask(masters[2].consts.tasks[8], crawling_hands_po, crawling_hands_pr);     //Mazchna
	masters[3].tasks[13] = new UTask(masters[3].consts.tasks[13], crawling_hands_po, crawling_hands_pr);   //Vannaka

	/* Crocodiles */
	masters[3].tasks[14] = new UTask(masters[3].consts.tasks[14], crocodiles_po, crocodiles_pr);   //Vannaka

	/* Dagannoth */
	masters[3].tasks[15] = new UTask(masters[3].consts.tasks[15], dagannoth_po, dagannoth_pr);   //Vannaka
	masters[4].tasks[15] = new UTask(masters[4].consts.tasks[15], dagannoth_po, dagannoth_pr);   //Chaeldar
	masters[5].tasks[13] = new UTask(masters[5].consts.tasks[13], dagannoth_po, dagannoth_pr);   //Nieve
	masters[6].tasks[12] = new UTask(masters[6].consts.tasks[12], dagannoth_po, dagannoth_pr);   //Duradel

	/* Dark Beasts */
	masters[5].tasks[14] = new UTask(masters[5].consts.tasks[14], dark_beasts_po, dark_beasts_pr);   //Nieve
	masters[6].tasks[13] = new UTask(masters[6].consts.tasks[13], dark_beasts_po, dark_beasts_pr);   //Duradel

	/* Dark Warriors */
	masters[0].tasks[8] = new UTask(masters[0].consts.tasks[8], w_dark_warrs_po, w_dark_warrs_pr);   //Krystilia

	/* Desert Lizards */
	masters[1].tasks[9] = new UTask(masters[1].consts.tasks[9], desert_liz_po, desert_liz_pr);     //Turael
	masters[2].tasks[9] = new UTask(masters[2].consts.tasks[9], desert_liz_po, desert_liz_pr);     //Mazchna
	masters[3].tasks[16] = new UTask(masters[3].consts.tasks[16], desert_liz_po, desert_liz_pr);   //Vannaka
	masters[4].tasks[16] = new UTask(masters[4].consts.tasks[16], desert_liz_po, desert_liz_pr);   //Chaeldar

	/* Dogs */
	masters[1].tasks[10] = new UTask(masters[1].consts.tasks[10], dogs_po, dogs_pr);   //Turael
	masters[2].tasks[10] = new UTask(masters[2].consts.tasks[10], dogs_po, dogs_pr);   //Mazchna

	/* Dust Devils */
	masters[3].tasks[17] = new UTask(masters[3].consts.tasks[17], dust_devils_po, dust_devils_pr);   //Vannaka
	masters[4].tasks[17] = new UTask(masters[4].consts.tasks[17], dust_devils_po, dust_devils_pr);   //Chaeldar
	masters[5].tasks[15] = new UTask(masters[5].consts.tasks[15], dust_devils_po, dust_devils_pr);   //Nieve
	masters[6].tasks[14] = new UTask(masters[6].consts.tasks[14], dust_devils_po, dust_devils_pr);   //Duradel

	/* Dwarves */
	masters[1].tasks[11] = new UTask(masters[1].consts.tasks[11], dwarves_po, dwarves_pr);    //Turael

	/* Earth Warriors */
	masters[0].tasks[9] = new UTask(masters[0].consts.tasks[9], w_earth_warrs_po, w_earth_warrs_pr);    //Krystilia
	masters[2].tasks[11] = new UTask(masters[2].consts.tasks[11], earth_warrs_po, earth_warrs_pr);   //Mazchna
	masters[3].tasks[18] = new UTask(masters[3].consts.tasks[18], earth_warrs_po, earth_warrs_pr);   //Vannaka

	/* Elves */
	masters[3].tasks[19] = new UTask(masters[3].consts.tasks[19], elves_po, elves_pr);   //Vannaka
	masters[4].tasks[18] = new UTask(masters[4].consts.tasks[18], elves_po, elves_pr);   //Chaeldar
	masters[5].tasks[16] = new UTask(masters[5].consts.tasks[16], elves_po, elves_pr);   //Nieve
	masters[6].tasks[15] = new UTask(masters[6].consts.tasks[15], elves_po, elves_pr);   //Duradel

	/* Ents */
	masters[0].tasks[10] = new UTask(masters[0].consts.tasks[10], w_ents_po, w_ents_pr);  //Krystilia

	/* Fever Spiders */
	masters[3].tasks[20] = new UTask(masters[3].consts.tasks[20], fever_spiders_po, fever_spiders_pr);   //Vannaka
	masters[4].tasks[19] = new UTask(masters[4].consts.tasks[19], fever_spiders_po, fever_spiders_pr);   //Chaeldar

	/* Fire Giants */
	masters[0].tasks[11] = new UTask(masters[0].consts.tasks[11], w_fire_giants_po, w_fire_giants_pr);  //Krystilia
	masters[3].tasks[21] = new UTask(masters[3].consts.tasks[21], fire_giants_po, fire_giants_pr);   //Vannaka
	masters[4].tasks[20] = new UTask(masters[4].consts.tasks[20], fire_giants_po, fire_giants_pr);   //Chaeldar
	masters[5].tasks[17] = new UTask(masters[5].consts.tasks[17], fire_giants_po, fire_giants_pr);   //Nieve
	masters[6].tasks[16] = new UTask(masters[6].consts.tasks[16], fire_giants_po, fire_giants_pr);   //Duradel

	/* Flesh Crawlers */
	masters[2].tasks[12] = new UTask(masters[2].consts.tasks[12], flesh_crawlers_po, flesh_crawlers_pr);   //Mazchna

	/* Fossil Island Wyverns */
	masters[4].tasks[21] = new UTask(masters[4].consts.tasks[21], fossil_wyvs_po, fossil_wyvs_pr);   //Chaeldar
	masters[5].tasks[18] = new UTask(masters[5].consts.tasks[18], fossil_wyvs_po, fossil_wyvs_pr);   //Nieve
	masters[6].tasks[17] = new UTask(masters[6].consts.tasks[17], fossil_wyvs_po, fossil_wyvs_pr);   //Duradel

	/* Gargoyles */
	masters[3].tasks[22] = new UTask(masters[3].consts.tasks[22], gargoyles_po, gargoyles_pr);   //Vannaka
	masters[4].tasks[22] = new UTask(masters[4].consts.tasks[22], gargoyles_po, gargoyles_pr);   //Chaeldar
	masters[5].tasks[19] = new UTask(masters[5].consts.tasks[19], gargoyles_po, gargoyles_pr);   //Nieve
	masters[6].tasks[18] = new UTask(masters[6].consts.tasks[18], gargoyles_po, gargoyles_pr);   //Duradel

	/* Ghosts */
	masters[1].tasks[12] = new UTask(masters[1].consts.tasks[12], ghosts_po, ghosts_pr);   //Turael
	masters[2].tasks[13] = new UTask(masters[2].consts.tasks[13], ghosts_po, ghosts_pr);   //Mazchna

	/* Ghouls */
	masters[2].tasks[14] = new UTask(masters[2].consts.tasks[14], ghouls_po, ghouls_pr);   //Mazchna
	masters[3].tasks[23] = new UTask(masters[3].consts.tasks[23], ghouls_po, ghouls_pr);   //Vannaka

	/* Goblins */
	masters[1].tasks[13] = new UTask(masters[1].consts.tasks[13], goblins_po, goblins_pr);    //Turael

	/* Greater Demons */
	masters[0].tasks[12] = new UTask(masters[0].consts.tasks[12], w_great_dems_po, w_great_dems_pr);  //Krystilia
	masters[4].tasks[23] = new UTask(masters[4].consts.tasks[23], great_dems_po, great_dems_pr);   //Chaeldar
	masters[5].tasks[20] = new UTask(masters[5].consts.tasks[20], great_dems_po, great_dems_pr);   //Nieve
	masters[6].tasks[19] = new UTask(masters[6].consts.tasks[19], great_dems_po, great_dems_pr);   //Duradel

	/* Green Dragons */
	masters[0].tasks[13] = new UTask(masters[0].consts.tasks[13], w_green_drags_po, w_green_drags_pr);  //Krystilia
	masters[3].tasks[24] = new UTask(masters[3].consts.tasks[24], green_drags_po, green_drags_pr);   //Vannaka

	/* Harpie Bug Swarms */
	masters[3].tasks[25] = new UTask(masters[3].consts.tasks[25], harpie_bugs_po, harpie_bugs_pr);   //Vannaka
	masters[4].tasks[24] = new UTask(masters[4].consts.tasks[24], harpie_bugs_po, harpie_bugs_pr);   //Chaeldar

	/* Hellhounds */
	masters[0].tasks[14] = new UTask(masters[0].consts.tasks[14], w_hellhounds_po, w_hellhounds_pr);  //Krystilia
	masters[3].tasks[26] = new UTask(masters[3].consts.tasks[26], hellhounds_po, hellhounds_pr);   //Vannaka
	masters[4].tasks[25] = new UTask(masters[4].consts.tasks[25], hellhounds_po, hellhounds_pr);   //Chaeldar
	masters[5].tasks[21] = new UTask(masters[5].consts.tasks[21], hellhounds_po, hellhounds_pr);   //Nieve
	masters[6].tasks[20] = new UTask(masters[6].consts.tasks[20], hellhounds_po, hellhounds_pr);   //Duradel

	/* Hill Giants */
	masters[2].tasks[15] = new UTask(masters[2].consts.tasks[15], hill_giants_po, hill_giants_pr);   //Mazchna
	masters[3].tasks[27] = new UTask(masters[3].consts.tasks[27], hill_giants_po, hill_giants_pr);   //Vannaka

	/* Hobgoblins */
	masters[2].tasks[16] = new UTask(masters[2].consts.tasks[16], hobgoblins_po, hobgoblins_pr);   //Mazchna
	masters[3].tasks[28] = new UTask(masters[3].consts.tasks[28], hobgoblins_po, hobgoblins_pr);   //Vannaka

	/* Ice Giants */
	masters[0].tasks[15] = new UTask(masters[0].consts.tasks[15], w_ice_giants_po, w_ice_giants_pr);  //Krystilia
	masters[3].tasks[29] = new UTask(masters[3].consts.tasks[29], ice_giants_po, ice_giants_pr);   //Vannaka

	/* Ice Warriors */
	masters[0].tasks[16] = new UTask(masters[0].consts.tasks[16], w_ice_warrs_po, w_ice_warrs_pr);  //Krystilia
	masters[2].tasks[17] = new UTask(masters[2].consts.tasks[17], ice_warrs_po, ice_warrs_pr);   //Mazchna
	masters[3].tasks[30] = new UTask(masters[3].consts.tasks[30], ice_warrs_po, ice_warrs_pr);   //Vannaka

	/* Icefiends */
	masters[1].tasks[14] = new UTask(masters[1].consts.tasks[14], icefiends_po, icefiends_pr);    //Turael

	/* Infernal Mages */
	masters[3].tasks[31] = new UTask(masters[3].consts.tasks[31], infernal_mages_po, infernal_mages_pr);   //Vannaka
	masters[4].tasks[26] = new UTask(masters[4].consts.tasks[26], infernal_mages_po, infernal_mages_pr);   //Chaeldar

	/* Iron Dragons */
	masters[4].tasks[27] = new UTask(masters[4].consts.tasks[27], iron_drags_po, iron_drags_pr);   //Chaeldar
	masters[5].tasks[22] = new UTask(masters[5].consts.tasks[22], iron_drags_po, iron_drags_pr);   //Nieve
	masters[6].tasks[21] = new UTask(masters[6].consts.tasks[21], iron_drags_po, iron_drags_pr);   //Duradel

	/* Jellies */
	masters[3].tasks[32] = new UTask(masters[3].consts.tasks[32], jellies_po, jellies_pr);   //Vannaka
	masters[4].tasks[28] = new UTask(masters[4].consts.tasks[28], jellies_po, jellies_pr);   //Chaeldar

	/* Jungle Horrors */
	masters[3].tasks[33] = new UTask(masters[3].consts.tasks[33], jungle_horrs_po, jungle_horrs_pr);   //Vannaka
	masters[4].tasks[29] = new UTask(masters[4].consts.tasks[29], jungle_horrs_po, jungle_horrs_pr);   //Chaeldar

	/* Kalphites */
	masters[1].tasks[15] = new UTask(masters[1].consts.tasks[15], kalphites_po, kalphites_pr);   //Turael
	masters[2].tasks[18] = new UTask(masters[2].consts.tasks[18], kalphites_po, kalphites_pr);   //Mazchna
	masters[3].tasks[34] = new UTask(masters[3].consts.tasks[34], kalphites_po, kalphites_pr);   //Vannaka
	masters[4].tasks[30] = new UTask(masters[4].consts.tasks[30], kalphites_po, kalphites_pr);   //Chaeldar
	masters[5].tasks[23] = new UTask(masters[5].consts.tasks[23], kalphites_po, kalphites_pr);   //Nieve
	masters[6].tasks[22] = new UTask(masters[6].consts.tasks[22], kalphites_po, kalphites_pr);   //Duradel

	/* Killerwatts */
	masters[2].tasks[19] = new UTask(masters[2].consts.tasks[19], killerwatts_po, killerwatts_pr);   //Mazchna
	masters[3].tasks[35] = new UTask(masters[3].consts.tasks[35], killerwatts_po, killerwatts_pr);   //Vannaka

	/* Kurasks */
	masters[3].tasks[36] = new UTask(masters[3].consts.tasks[36], kurasks_po, kurasks_pr);   //Vannaka
	masters[4].tasks[31] = new UTask(masters[4].consts.tasks[31], kurasks_po, kurasks_pr);   //Chaeldar
	masters[5].tasks[24] = new UTask(masters[5].consts.tasks[24], kurasks_po, kurasks_pr);   //Nieve
	masters[6].tasks[23] = new UTask(masters[6].consts.tasks[23], kurasks_po, kurasks_pr);   //Duradel

	/* Lava Dragons */
	masters[0].tasks[17] = new UTask(masters[0].consts.tasks[17], w_lava_drags_po, w_lava_drags_pr);  //Krystilia

	/* Lesser Demons */
	masters[0].tasks[18] = new UTask(masters[0].consts.tasks[18], w_less_dems_po, w_less_dems_pr);  //Krystilia
	masters[3].tasks[37] = new UTask(masters[3].consts.tasks[37], less_dems_po, less_dems_pr);   //Vannaka
	masters[4].tasks[32] = new UTask(masters[4].consts.tasks[32], less_dems_po, less_dems_pr);   //Chaeldar

	/* Lizardmen */
	masters[4].tasks[33] = new UTask(masters[4].consts.tasks[33], lizardmen_po, lizardmen_pr);   //Chaeldar
	masters[5].tasks[25] = new UTask(masters[5].consts.tasks[25], lizardmen_po, lizardmen_pr);   //Nieve
	masters[6].tasks[24] = new UTask(masters[6].consts.tasks[24], lizardmen_po, lizardmen_pr);   //Duradel

	/* Magic Axes */
	masters[0].tasks[19] = new UTask(masters[0].consts.tasks[19], w_mag_axes_po, w_mag_axes_pr);  //Krystilia

	/* Mammoths */
	masters[0].tasks[20] = new UTask(masters[0].consts.tasks[20], w_mammoths_po, w_mammoths_pr);  //Krystilia

	/* Minotaurs */
	masters[1].tasks[16] = new UTask(masters[1].consts.tasks[16], minotaurs_po, minotaurs_pr);    //Turael

	/* Mithril Dragons */
	masters[5].tasks[26] = new UTask(masters[5].consts.tasks[26], mithril_drags_po, mithril_drags_pr);   //Nieve
	masters[6].tasks[25] = new UTask(masters[6].consts.tasks[25], mithril_drags_po, mithril_drags_pr);   //Duradel

	/* Mogres */
	masters[2].tasks[20] = new UTask(masters[2].consts.tasks[20], mogres_po, mogres_pr);   //Mazchna
	masters[3].tasks[39] = new UTask(masters[3].consts.tasks[39], mogres_po, mogres_pr);   //Vannaka
	masters[4].tasks[34] = new UTask(masters[4].consts.tasks[34], mogres_po, mogres_pr);   //Chaeldar

	/* Molanisks */
	masters[3].tasks[40] = new UTask(masters[3].consts.tasks[40], molanisks_po, molanisks_pr);   //Vannaka
	masters[4].tasks[35] = new UTask(masters[4].consts.tasks[35], molanisks_po, molanisks_pr);   //Chaeldar

	/* Monkeys */
	masters[1].tasks[17] = new UTask(masters[1].consts.tasks[17], monkeys_po, monkeys_pr);    //Turael

	/* Moss Giants */
	masters[3].tasks[41] = new UTask(masters[3].consts.tasks[41], moss_giants_po, moss_giants_pr);   //Vannaka

	/* Mutated Zygomites */
	masters[4].tasks[36] = new UTask(masters[4].consts.tasks[36], mutated_zygs_po, mutated_zygs_pr);   //Chaeldar
	masters[5].tasks[27] = new UTask(masters[5].consts.tasks[27], mutated_zygs_po, mutated_zygs_pr);   //Nieve
	masters[6].tasks[26] = new UTask(masters[6].consts.tasks[26], mutated_zygs_po, mutated_zygs_pr);   //Duradel

	/* Nechryael */
	masters[3].tasks[42] = new UTask(masters[3].consts.tasks[42], nechryael_po, nechryael_pr);   //Vannaka
	masters[4].tasks[37] = new UTask(masters[4].consts.tasks[37], nechryael_po, nechryael_pr);   //Chaeldar
	masters[5].tasks[28] = new UTask(masters[5].consts.tasks[28], nechryael_po, nechryael_pr);   //Nieve
	masters[6].tasks[27] = new UTask(masters[6].consts.tasks[27], nechryael_po, nechryael_pr);   //Duradel

	/* Ogres */
	masters[3].tasks[43] = new UTask(masters[3].consts.tasks[43], ogres_po, ogres_pr);   //Vannaka

	/* Otherworldly Beings */
	masters[3].tasks[44] = new UTask(masters[3].consts.tasks[44], otherworldly_beings_po, otherworldly_beings_pr);   //Vannaka

	/* Pyrefiends */
	masters[2].tasks[21] = new UTask(masters[2].consts.tasks[21], pyrefiends_po, pyrefiends_pr);   //Mazchna
	masters[3].tasks[45] = new UTask(masters[3].consts.tasks[45], pyrefiends_po, pyrefiends_pr);   //Vannaka
	masters[4].tasks[38] = new UTask(masters[4].consts.tasks[38], pyrefiends_po, pyrefiends_pr);   //Chaeldar

	/* Rats */
	masters[1].tasks[18] = new UTask(masters[1].consts.tasks[18], rats_po, rats_pr);    //Turael

	/* Red Dragons */
	masters[5].tasks[29] = new UTask(masters[5].consts.tasks[29], red_drags_po, red_drags_pr);   //Nieve
	masters[6].tasks[28] = new UTask(masters[6].consts.tasks[28], red_drags_po, red_drags_pr);   //Duradel

	/* Revenants */
	masters[0].tasks[21] = new UTask(masters[0].consts.tasks[21], w_revenants_po, w_revenants_pr);  //Krystilia

	/* Rockslugs */
	masters[2].tasks[22] = new UTask(masters[2].consts.tasks[22], rockslugs_po, rockslugs_pr);   //Mazchna
	masters[3].tasks[46] = new UTask(masters[3].consts.tasks[46], rockslugs_po, rockslugs_pr);   //Vannaka
	masters[4].tasks[39] = new UTask(masters[4].consts.tasks[39], rockslugs_po, rockslugs_pr);   //Chaeldar

	/* Rogues */
	masters[0].tasks[22] = new UTask(masters[0].consts.tasks[22], w_rogues_po, w_rogues_pr);  //Krystilia

	/* Rune Dragons */
	masters[5].tasks[30] = new UTask(masters[5].consts.tasks[30], rune_drags_po, rune_drags_pr);   //Nieve
	masters[6].tasks[29] = new UTask(masters[6].consts.tasks[29], rune_drags_po, rune_drags_pr);   //Duradel

	/* Scabarites */
	masters[5].tasks[31] = new UTask(masters[5].consts.tasks[31], scabarites_po, scabarites_pr);   //Nieve

	/* Scorpions */
	masters[0].tasks[23] = new UTask(masters[0].consts.tasks[23], w_scorpions_po, w_scorpions_pr);   //Krystilia
	masters[1].tasks[19] = new UTask(masters[1].consts.tasks[19], scorpions_po, scorpions_pr);    //Turael
	masters[2].tasks[23] = new UTask(masters[2].consts.tasks[23], scorpions_po, scorpions_pr);    //Mazchna

	/* Sea Snakes */
	masters[3].tasks[47] = new UTask(masters[3].consts.tasks[47], sea_snakes_po, sea_snakes_pr);   //Vannaka

	/* Shades */
	masters[2].tasks[24] = new UTask(masters[2].consts.tasks[24], shades_po, shades_pr);   //Mazchna
	masters[3].tasks[38] = new UTask(masters[3].consts.tasks[38], shades_po, shades_pr);   //Vannaka

	/* Shadow Warriors */
	masters[3].tasks[48] = new UTask(masters[3].consts.tasks[48], shadow_warrs_po, shadow_warrs_pr);   //Vannaka
	masters[4].tasks[40] = new UTask(masters[4].consts.tasks[40], shadow_warrs_po, shadow_warrs_pr);   //Chaeldar

	/* Skeletal Wyverns */
	masters[4].tasks[41] = new UTask(masters[4].consts.tasks[41], skeletal_wyvs_po, skeletal_wyvs_pr);   //Chaeldar
	masters[5].tasks[32] = new UTask(masters[5].consts.tasks[32], skeletal_wyvs_po, skeletal_wyvs_pr);   //Nieve
	masters[6].tasks[30] = new UTask(masters[6].consts.tasks[30], skeletal_wyvs_po, skeletal_wyvs_pr);   //Duradel

	/* Skeletons */
	masters[0].tasks[24] = new UTask(masters[0].consts.tasks[24], w_skeletons_po, w_skeletons_pr);  //Krystilia
	masters[1].tasks[20] = new UTask(masters[1].consts.tasks[20], skeletons_po, skeletons_pr);   //Turael
	masters[2].tasks[25] = new UTask(masters[2].consts.tasks[25], skeletons_po, skeletons_pr);   //Mazchna

	/* Smoke Devils */
	masters[5].tasks[33] = new UTask(masters[5].consts.tasks[33], smoke_devils_po, smoke_devils_pr);   //Nieve
	masters[6].tasks[31] = new UTask(masters[6].consts.tasks[31], smoke_devils_po, smoke_devils_pr);   //Duradel

	/* Spiders */
	masters[0].tasks[25] = new UTask(masters[0].consts.tasks[25], w_spiders_po, w_spiders_pr);   //Krystilia
	masters[1].tasks[21] = new UTask(masters[1].consts.tasks[21], spiders_po, spiders_pr);    //Turael

	/* Spiritual Creatures */
	masters[0].tasks[26] = new UTask(masters[0].consts.tasks[26], w_spirituals_po, w_spirituals_pr);  //Krystilia
	masters[3].tasks[49] = new UTask(masters[3].consts.tasks[49], spirituals_po, spirituals_pr);   //Vannaka
	masters[4].tasks[42] = new UTask(masters[4].consts.tasks[42], spirituals_po, spirituals_pr);   //Chaeldar
	masters[5].tasks[34] = new UTask(masters[5].consts.tasks[34], spirituals_po, spirituals_pr);   //Nieve
	masters[6].tasks[32] = new UTask(masters[6].consts.tasks[32], spirituals_po, spirituals_pr);   //Duradel

	/* Steel Dragons */
	masters[4].tasks[43] = new UTask(masters[4].consts.tasks[43], steel_drags_po, steel_drags_pr);   //Chaeldar
	masters[5].tasks[35] = new UTask(masters[5].consts.tasks[35], steel_drags_po, steel_drags_pr);   //Nieve
	masters[6].tasks[33] = new UTask(masters[6].consts.tasks[33], steel_drags_po, steel_drags_pr);   //Duradel

	/* Suqahs */
	masters[5].tasks[36] = new UTask(masters[5].consts.tasks[36], suqahs_po, suqahs_pr);   //Nieve
	masters[6].tasks[34] = new UTask(masters[6].consts.tasks[34], suqahs_po, suqahs_pr);   //Duradel

	/* Terror Dogs */
	masters[3].tasks[50] = new UTask(masters[3].consts.tasks[50], terror_dogs_po, terror_dogs_pr);   //Vannaka

	/* Trolls */
	masters[3].tasks[51] = new UTask(masters[3].consts.tasks[51], trolls_po, trolls_pr);   //Vannaka
	masters[4].tasks[44] = new UTask(masters[4].consts.tasks[44], trolls_po, trolls_pr);   //Chaeldar
	masters[5].tasks[37] = new UTask(masters[5].consts.tasks[37], trolls_po, trolls_pr);   //Nieve
	masters[6].tasks[35] = new UTask(masters[6].consts.tasks[35], trolls_po, trolls_pr);   //Duradel

	/* Turoth */
	masters[3].tasks[52] = new UTask(masters[3].consts.tasks[52], turoth_po, turoth_pr);   //Vannaka
	masters[4].tasks[45] = new UTask(masters[4].consts.tasks[45], turoth_po, turoth_pr);   //Chaeldar
	masters[5].tasks[38] = new UTask(masters[5].consts.tasks[38], turoth_po, turoth_pr);   //Nieve

	/* TzHaar */
	masters[4].tasks[46] = new UTask(masters[4].consts.tasks[46], tzhaar_po, tzhaar_pr);   //Chaeldar
	masters[5].tasks[39] = new UTask(masters[5].consts.tasks[39], tzhaar_po, tzhaar_pr);   //Nieve
	masters[6].tasks[36] = new UTask(masters[6].consts.tasks[36], tzhaar_po, tzhaar_pr);   //Duradel

	/* Vampyres */
	masters[2].tasks[26] = new UTask(masters[2].consts.tasks[26], vampyres_po, vampyres_pr);   //Mazchna
	masters[3].tasks[53] = new UTask(masters[3].consts.tasks[53], vampyres_po, vampyres_pr);   //Vannaka

	/* Wall Beasts */
	masters[2].tasks[27] = new UTask(masters[2].consts.tasks[27], wall_beasts_po, wall_beasts_pr);   //Mazchna
	masters[3].tasks[54] = new UTask(masters[3].consts.tasks[54], wall_beasts_po, wall_beasts_pr);   //Vannaka
	masters[4].tasks[47] = new UTask(masters[4].consts.tasks[47], wall_beasts_po, wall_beasts_pr);   //Chaeldar

	/* Waterfiends */
	masters[6].tasks[37] = new UTask(masters[6].consts.tasks[37], waterfiends_po, waterfiends_pr);   //Duradel

	/* Werewolves */
	masters[3].tasks[55] = new UTask(masters[3].consts.tasks[55], werewolves_po, werewolves_pr);   //Vannaka

	/* Wolves */
	masters[1].tasks[22] = new UTask(masters[1].consts.tasks[22], wolves_po, wolves_pr);   //Turael
	masters[2].tasks[28] = new UTask(masters[2].consts.tasks[28], wolves_po, wolves_pr);   //Mazchna

	/* Zombies */
	masters[1].tasks[23] = new UTask(masters[1].consts.tasks[23], zombies_po, zombies_pr);   //Turael
	masters[2].tasks[29] = new UTask(masters[2].consts.tasks[29], zombies_po, zombies_pr);   //Mazchna

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
