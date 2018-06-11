"use strict";
var s_lvl = -1;
var v_s_lvl = false;
var v_cmb_lvl = false;
var wen = false;

/* The number of slayer masters selected. */
var num_masters = 0;
/* Each masters enabled/disabled status. */
var en_masters = [
	false,
	false,
	false,
	false,
	false,
	false,
	false
];

/* Represents a task. Contains the following information:
 * 		An ID, which allows us to change the html task.
 *		The task's name, used for printing out errors.
 *		The task's slayer requirement.
 *		The list of masters which can assign the task.
 *		A number keeping track of how many masters need the value from this task.
 *		Two booleans, which keep track of whether or not the task's value has been given.
 *		A boolean, stating whether or not it's a wildy task that can be fuelled by another task
 *			A reference to the task's source, if it can be fuelled
 */
function task_form(i, n, r, h, p, m) {
	this.id = i;
	this.name = n;
	this.reqt = r;
	this.masters = m;

	this.has_parent = h;
	this.parent = p;

	this.count = 0;
	this.r_valid = false;
	this.l_valid = false;
}

/* A list of all the tasks. */
var all_tasks = [
	new task_form("ab_spectres", "Aberrant Spectres", 60, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("abyssal_dems", "Abyssal Demons", 85, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("adamant_drags", "Adamant Dragons", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("ankou", "Ankou", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("aviansies", "Aviansies", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("banshees", "Banshees", 15, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("basilisks", "Basilisks", 40, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("bats", "Bats", 1, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("bears", "Bears", 1, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("birds", "Birds", 1, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("black_dems", "Black Demons", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("black_drags", "Black Dragons", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("bloodveld", "Bloodveld", 50, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("blue_drags", "Blue Dragons", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("bosses", "Bosses", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("brine_rats", "Brine Rats", 47, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   false]),	// Duradel

	new task_form("bronze_drags", "Bronze Dragons", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("catablepons", "Catablepons", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("cave_bugs", "Cave Bugs", 7, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("cave_crawlers", "Cave Crawlers", 10, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("cave_horrors", "Cave Horrors", 58, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("cave_kraken", "Cave Kraken", 87, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("cave_slimes", "Cave Slimes", 17, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("cockatrice", "Cockatrice", 25, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("cows", "Cows", 1, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("crawling_hands", "Crawling Hands", 5, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("crocodiles", "Crocodiles", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("dagannoth", "Dagannoth", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("dark_beasts", "Dark Beasts", 90, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("desert_liz", "Desert Lizards", 22, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("dogs", "Dogs", 1, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("dust_devils", "Dust Devils", 65, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("dwarves", "Dwarves", 1, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("earth_warrs", "Earth Warriors", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("elves", "Elves", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("fever_spiders", "Fever Spiders", 42, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("fire_giants", "Fire Giants", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("flesh_crawlers", "Flesh Crawlers", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("fossil_wyvs", "Fossil Island Wyverns", 66, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("gargoyles", "Gargoyles", 75, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("ghosts", "Ghosts", 1, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("ghouls", "Ghouls", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("goblins", "Goblins", 1, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("great_dems", "Greater Demons", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("green_drags", "Green Dragons", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("harpie_bugs", "Harpie Bug Swarms", 33, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("hellhounds", "Hellhounds", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("hill_giants", "Hill Giants", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("hobgoblins", "Hobgoblins", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("ice_giants", "Ice Giants", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("ice_warrs", "Ice Warriors", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("icefiends", "Icefiends", 1, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("infernal_mages", "Infernal Mages", 45, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("iron_drags", "Iron Dragons", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("jellies", "Jellies", 52, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("jungle_horrs", "Jungle Horrors", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("kalphites", "Kalphites", 1, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("killerwatts", "Killerwatts", 37, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("kurasks", "Kurasks", 70, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("less_dems", "Lesser Demons", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("lizardmen", "Lizardmen", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("minotaurs", "Minotaurs", 1, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("mithril_drags", "Mithril Dragons", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("mogres", "Mogres", 32, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("molanisks", "Molanisks", 39, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("monkeys", "Monkeys", 1, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("moss_giants", "Moss Giants", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("mutated_zygs", "Mutated Zygomites", 57, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("nechryael", "Nechryael", 80, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("ogres", "Ogres", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("otherworldly_beings", "Otherworldly Beings", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("pyrefiends", "Pyrefiends", 30, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("rats", "Rats", 1, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("red_drags", "Red Dragons", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("rockslugs", "Rockslugs", 20, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("rune_drags", "Rune Dragons", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("scabarites", "Scabarites", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   false]),	// Duradel

	new task_form("scorpions", "Scorpions", 1, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("sea_snakes", "Sea Snakes", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("shades", "Shades", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("shadow_warrs", "Shadow Warriors", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("skeletal_wyvs", "Skeletal Wyverns", 72, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("skeletons", "Skeletons", 1, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("smoke_devils", "Smoke Devils", 93, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("spiders", "Spiders", 1, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("spirituals", "Spiritual Creatures", 63, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("steel_drags", "Steel Dragons", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("suqahs", "Suqahs", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("terror_dogs", "Terror Dogs", 40, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("trolls", "Trolls", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("turoth", "Turoth", 55, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   false]),	// Duradel

	new task_form("tzhaar", "TzHaar", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("vampyres", "Vampyres", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("wall_beasts", "Wall Beasts", 35, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("waterfiends", "Waterfiends", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   true]),	// Duradel

	new task_form("werewolves", "Werewolves", 1, false, -1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("wolves", "Wolves", 1, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("zombies", "Zombies", 1, false, -1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_ankou", "Ankou (Wilderness)", 1, true, 3,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_aviansies", "Aviansies (Wilderness)", 1, true, 4,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_bandits", "Bandits (Wilderness)", 1, false, -1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_bears", "Bears (Wilderness)", 1, true, 8,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_black_dems", "Black Demons (Wilderness)", 1, true, 10,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_black_drags", "Black Dragons (Wilderness)", 1, true, 11,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_bosses", "Bosses (Wilderness)", 1, false, -1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_chaos_druids", "Chaos Druids (Wilderness)", 1, false, -1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_dark_warrs", "Dark Warriors (Wilderness)", 1, false, -1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_earth_warrs", "Earth Warriors (Wilderness)", 1, true, 33,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_ents", "Ents (Wilderness)", 1, false, -1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_fire_giants", "Fire Giants (Wilderness)", 1, true, 36,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_great_dems", "Greater Demons (Wilderness)", 1, true, 43,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_green_drags", "Green Dragons (Wilderness)", 1, true, 44,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_hellhounds", "Hellhounds (Wilderness)", 1, true, 46,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_ice_giants", "Ice Giants (Wilderness)", 1, true, 49,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_ice_warrs", "Ice Warriors (Wilderness)", 1, true, 50,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_lava_drags", "Lava Dragons (Wilderness)", 1, false, -1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_less_dems", "Lesser Demons (Wilderness)", 1, true, 59,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_mag_axes", "Magic Axes (Wilderness)", 1, false, -1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_mammoths", "Mammoths (Wilderness)", 1, false, -1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_revenants", "Revenants (Wilderness)", 1, false, -1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_rogues", "Rogues (Wilderness)", 1, false, -1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_scorpions", "Scorpions (Wilderness)", 1, true, 77,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_skeletons", "Skeletons (Wilderness)", 1, true, 82,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_spiders", "Spiders (Wilderness)", 1, true, 84,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel

	new task_form("w_spirituals", "Spiritual Creatures (Wilderness)", 63, true, 85,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false])	// Duradel
];

/* Updates the player's slayer level. */
function upd_s_lvl(s) {
	var i, task;

	s_lvl = s;
	v_s_lvl = !(isNaN(s) || s < 1 || 99 < s);

	document.getElementById("s_lvl_in_drop").className = v_s_lvl ? "simple_data" : "simple_data dropdown";
	document.getElementById("s_lvl_in").style.background = v_s_lvl ? "white" : "#ffa8a8";

	if (v_s_lvl) {

		if (s < 50 || !v_s_lvl || document.getElementById("cmb_lvl_in").value < 100) {
			disable_master("duradel", 6);
			document.getElementById("dura_tt").className = "simple_label";
		} else {
			enable_master("duradel");
			document.getElementById("dura_tt").className = "simple_label dropdown";
		}

		for (i = 0; i < all_tasks.length; i++) { upd_task_disp(all_tasks[i]); }
	}

	toggle_inter();
}

/* Verifies the player's combat level. */
function upd_cmb_lvl(c) {

	v_cmb_lvl = !(isNaN(c) || c < 3 || 126 < c);

	document.getElementById("cmb_lvl_in_drop").className = v_cmb_lvl ? "simple_data" : "simple_data dropdown";
	document.getElementById("cmb_lvl_in").style.background = v_cmb_lvl ? "white" : "#ffa8a8";

	if (v_cmb_lvl) {

		if (c < 20) {
			disable_master("mazchna", 2);
		} else {
			enable_master("mazchna");
		}

		if (c < 40) {
			disable_master("vannaka", 3);
		} else {
			enable_master("vannaka");
		}

		if (c < 70) {
			disable_master("chaeldar", 4);
		} else {
			enable_master("chaeldar");
		}

		if (c < 85) {
			disable_master("nieve", 5);
		} else {
			enable_master("nieve");
		}

		if (c < 100 || !v_s_lvl || s_lvl < 50) {
			disable_master("duradel", 6);
			document.getElementById("dura_tt").className = "simple_label";
		} else {
			enable_master("duradel");
			document.getElementById("dura_tt").className = "simple_label dropdown";
		}
	}

	toggle_inter();
}

/* If we've changed the criteria for enabling the interactive pane, change its visibility. */
function toggle_inter() {
	var v = v_s_lvl && v_cmb_lvl;

	document.getElementById("interactive").style.display = v ? "block" : "none";

	document.getElementById("submission").className = v ? "" : "dropdown";
	document.getElementById("generate").disabled = v ? "" : "disabled";

	document.getElementById("nosub_s").style.display = v_s_lvl ? "none" : "block";
	document.getElementById("nosub_cmb").style.display = v_cmb_lvl ? "none" : "block";
}

/* Blocks a user from selecting a given master. */
function disable_master(n, m) {
	var parent = document.getElementById(n),
		checkbox = document.getElementById(n + "_entry");

	parent.style.background = "#f73d3d";
	parent.className = "master dropdown";

	checkbox.disabled = "disabled";
	if (checkbox.checked) { upd_masters(false, m); }
	checkbox.checked = "";
}

/* Allows a user to select a given master. */
function enable_master(n) {
	var parent = document.getElementById(n),
		checkbox = document.getElementById(n + "_entry");

	parent.style.background = "";
	parent.className = "master";

	checkbox.disabled = "";
}

/* Updates a master. */
function upd_masters(e, m) {
	var i, task;

	num_masters += (e ? 1 : -1);

	for (i = 0; i < all_tasks.length; i++) {
		task = all_tasks[i];
		if (task.masters[m]) {
			task.count += (e ? 1 : -1);
		}
		upd_task_disp(task);
	}
}

/* Shows the prompt for wpelite if Nieve is selected. */
function upd_wpelite(e) {
	document.getElementById("wpelite").style.display = e ? "inline-block" : "none";
}

/* Shows the wilderness section if Krystilia is selected. */
function upd_wildy(e) {
	document.getElementById("wildy").style.display = e ? "block" : "none";
}

/* Changes the possibility settings for a task. */
function upd_poss(x, po) {
	var id = all_tasks[x].id;
	document.forms.user_in[id + "_pr_r"].disabled = po ? "" : "disabled";
	document.forms.user_in[id + "_pr_r"].parentElement.className = po ? "range_pref" : "range_pref dis";
	document.forms.user_in[id + "_pr_l"].disabled = po ? "" : "disabled";
	document.forms.user_in[id + "_pr_l"].className = po ? "" : "dis";
}

/* Validates the range pref value for a task. */
function set_r(x) {
	var task = all_tasks[x];
	task.r_valid = true;
	supp_task(task.id);
}

/* Validates the value of a verbose input box, and validates the task if it is. */
function valid_lit(x, elem) {
	var task = all_tasks[x];
	if (elem.value === "" || isNaN(elem.value)) {
		elem.parentElement.className = "lit_pref dropdown";
		elem.style.background = "#ffa8a8";
		task.l_valid = false;
	} else {
		elem.parentElement.className = "lit_pref";
		elem.style.background = "white";
		task.l_valid = true;
		supp_task(task.id);
	}
}

/* Updates the display of all tasks whose values could be forwarded. */
function upd_wen(x) {
	var i, task;

	wen = x;
	for (i = 98; i < all_tasks.length; i++) {
		task = all_tasks[i];
		if (task.has_parent) {
			upd_task_disp(task);
		}
	}
}

/* Updates the display of a task based on the slayer level,
 *		wen, and the display of its parent. */
function upd_task_disp(task) {
	var valid = (task.count > 0 && s_lvl >= task.reqt),
		elem = document.getElementById(task.id);

	if (!valid) {
		elem.style.display = "none";
		return;
	}

	if (!task.has_parent || !wen) {
		elem.style.display = "inline-block";
		return;
	}

	if (document.getElementById(all_tasks[task.parent].id).style.display === "none") {
		elem.style.display = "inline-block";
		return;
	}

	elem.style.display = "none";
}

/* Updates the preference inputs to be verbose or not. */
function upd_verbosity(v) {
	var tasks = document.getElementsByClassName("task"),
		ranges = document.getElementsByClassName("range_pref"),
		lits = document.getElementsByClassName("lit_pref"),
		i;

	for (i = 0; i < tasks.length; i++) {
		supp_task(tasks[i].id);
	}

	for (i = 0; i < ranges.length; i++) {
		ranges[i].style.display = v ? "none" : "block";
	}

	for (i = 0; i < lits.length; i++) {
		lits[i].style.display = v ? "block" : "none";
	}
}

/* Makes a task pop-out. Used when a user submits an underfilled form. */
function signal_task(id) {
	document.getElementById(id).style.background = "#f73d3d";
}

/* Suppresses a task, returning its background to none. */
function supp_task(id) {
	document.getElementById(id).style.background = "none";
}

/* Returns whether a given task is valid. */
function v_task(task, verb) {
	if (document.getElementById(task.id).style.display === "none" ||
	   	!document.forms.user_in[task.id + "_po"].checked) {
		return true;
	}

	return verb ? task.l_valid : task.r_valid;
}

/* Validates the form, and gives the output if it's valid. */
function validate() {
	var i, task, rv = true, msg = "", verb = document.getElementById("verb_entry").checked;

	if (document.getElementById("num_blocks_in").value < 0) {
		msg += "Please enter your available block slots.<br />";
		rv = false;
	}

	msg += msg === "" ? "" : "<br />";

	if (num_masters == 0) {
		msg += "Please select at least one master.<br />";
		rv = false;
	} else {
		for (i = 0; i < all_tasks.length; i++) {
			task = all_tasks[i];
			if (!v_task(task, verb)) {
				msg += "Please fill in your preference for " + task.name + ".<br /><br />";
				rv = false;
				signal_task(task.id);
			}
		}
	}

	if (!rv) {
		document.getElementById("error").innerHTML = msg;
		document.getElementById("error_popup").style.display = "block";
	} else {
		output();
	}
}

/* Closes the error popup. */
function close_error() {
	document.getElementById("error_popup").style.display = "none";
}

/* Opens the output in a new window. */
function output() {
	var win = window.open();
	win.document.write('<!DOCTYPE html>' +
					   '<html>' +

					   '<head>' +
					   '<title>Results</title>' +
					   '<meta charset="UTF-8">' +
					   '<meta name="description" content="Your Output!">' +
					   '<meta name="author" content="William Walker">' +
					   '</head>' +

					   '<body style="padding: 1vh 1vw; overflow: scroll; font-family: sans-serif;">' +
					   '<span>' + alg(document.forms.user_in.elements) + '</span>' +
					   '</body>' +

					   '</html>');
}
