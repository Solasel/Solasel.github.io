"use strict";
var v_s_lvl = false;
var v_cmb_lvl = false;
var v_num_blocks = false;

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

/* Represents a task. Contains a list of masters it pertains to,
	and a boolean saying if it's been interacted with. */
function task_form(n, r, m) {
	this.name = n;
	this.reqt = r;
	this.masters = m;
	this.count = 0;
	this.valid = false;
}

/* A list of all the tasks. */
var all_tasks = [
	new task_form("ab_spectres", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("abyssal_dems", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("adamant_drags", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("ankou", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("aviansies", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("bandits", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("banshees", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("basilisks", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("bats", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("bears", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("birds", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("black_dems", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("black_drags", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("bloodveld", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("blue_drags", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("bosses", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("brine_rats", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   false]),	// Duradel
	
	new task_form("bronze_drags", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("catablepons", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("cave_bugs", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("cave_crawlers", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("cave_horrors", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("cave_kraken", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("cave_slimes", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("chaos_druids", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("cockatrice", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("cows", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("crawling_hands", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("crocodiles", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("dagannoth", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("dark_beasts", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("dark_warrs", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("desert_liz", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("dogs", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("dust_devils", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("dwarves", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("earth_warrs", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("elves", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("ents", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("fever_spiders", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("fire_giants", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("flesh_crawlers", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("fossil_wyvs", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("gargoyles", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("ghosts", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("ghouls", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("goblins", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("great_dems", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("green_drags", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("harpie_bugs", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("hellhounds", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("hill_giants", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("hobgoblins", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("ice_giants", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("ice_warrs", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("icefiends", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("infernal_mages", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("iron_drags", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("jellies", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("jungle_horrs", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("kalphites", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("killerwatts", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("kurasks", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("lava_drags", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("less_dems", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("lizardmen", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("mag_axes", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("mammoths", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("minotaurs", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("mithril_drags", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("mogres", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("molanisks", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("monkeys", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("moss_giants", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("mutated_zygs", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("nechryael", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("ogres", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("otherworldly_beings", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("pyrefiends", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("rats", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("red_drags", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("revenants", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("rockslugs", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("rogues", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("rune_drags", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("scabarites", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   false]),	// Duradel
	
	new task_form("scorpions", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("sea_snakes", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("shades", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("shadow_warrs", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("skeletal_wyvs", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("skeletons", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("smoke_devils", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("spiders", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("spirituals", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("steel_drags", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("suqahs", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("terror_dogs", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("trolls", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("turoth", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   false]),	// Duradel
	
	new task_form("tzhaar", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("vampyres", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("wall_beasts", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("waterfiends", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   true]),	// Duradel
	
	new task_form("werewolves", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("wolves", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("zombies", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_ankou", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_aviansies", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_bandits", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_bears", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_black_dems", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_black_drags", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_bosses", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_chaos_druids", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_dark_warrs", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_earth_warrs", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_ents", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_fire_giants", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_great_dems", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_green_drags", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_hellhounds", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_ice_giants", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_ice_warrs", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_lava_drags", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_less_dems", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_mag_axes", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_mammoths", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_revenants", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_rogues", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_scorpions", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_skeletons", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_spiders", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_spirituals", 1,
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
	
	v_s_lvl = !(isNaN(s) || s < 1 || 99 < s);
	if (v_s_lvl) {
		document.getElementById("s_lvl_in_drop").className = "simple_data";
		document.getElementById("s_lvl_in").style.background = "white";
		// for (i = 0; i < all_tasks.length; i++) { upd_task_disp(all_tasks[i], s); }
		if (s < 50 || document.getElementById("cmb_lvl_in").value < 100) {
			disable_master("duradel");
			document.getElementById("dura_tt").className = "simple_label";
		} else {
			enable_master("duradel");
			document.getElementById("dura_tt").className = "simple_label dropdown";
		}
	} else {
		document.getElementById("s_lvl_in_drop").className = "simple_data dropdown";
		document.getElementById("s_lvl_in").style.background = "#ffa8a8";
	}
}

/* Verifies the player's combat level. */
function upd_cmb_lvl(c) {
	v_cmb_lvl = !(isNaN(c) || c < 3 || 126 < c);
	if (v_cmb_lvl) {
		document.getElementById("cmb_lvl_in_drop").className = "simple_data";
		document.getElementById("cmb_lvl_in").style.background = "white";
		if (c < 20) {
			disable_master("mazchna");
		} else {
			enable_master("mazchna");
		}
		
		if (c < 40) {
			disable_master("vannaka");
		} else {
			enable_master("vannaka");
		}
		
		if (c < 70) {
			disable_master("chaeldar");
		} else {
			enable_master("chaeldar");
		}
		
		if (c < 85) {
			disable_master("nieve");
		} else {
			enable_master("nieve");
		}
		
		if (c < 100 || !v_s_lvl || document.getElementById("s_lvl_in").value < 50) {
			disable_master("duradel");
			document.getElementById("dura_tt").className = "simple_label";
		} else {
			enable_master("duradel");
			document.getElementById("dura_tt").className = "simple_label dropdown";
		}
		
	} else {
		document.getElementById("cmb_lvl_in_drop").className = "simple_data dropdown";
		document.getElementById("cmb_lvl_in").style.background = "#ffa8a8";
	}
}

/* Disables a master. */
function disable_master(m) {
	var parent = document.getElementById(m),
		checkbox = document.getElementById(m + "_entry");
	
	parent.style.background = "#f73d3d";
	parent.className = "master dropdown_master";
	
	checkbox.className = "simple_data dropdown_check";
	checkbox.disabled = "disabled";
	checkbox.checked = "";
}

/* Enables a master. */
function enable_master(m) {
	var parent = document.getElementById(m),
		checkbox = document.getElementById(m + "_entry");
	
	parent.style.background = "";
	parent.className = "master";
	
	checkbox.className = "simple_data";
	checkbox.disabled = "";
}

/* Verifies a player's number of block slots. */
function upd_num_blocks(x) {
	v_num_blocks = (x > 0);
}

/* Shows the prompt for wpelite if nieve is selected. */
function upd_wpelite(x) {
	document.getElementById("wpelite").style.display = x ? "inline-block" : "none";
}

/* Updates a master. */
function upd_masters(x, m) {
	var i, task,
		s = document.getElementById("s_lvl_in").value;
	
	num_masters += (x ? 1 : -1);
	en_masters[m] = x;
	
	/*
	for (i = 0; i < all_tasks.length; i++) {
		task = all_tasks[i];
		if (task.masters[m]) {
			task.count += (x ? 1 : -1);
			if (v_s_lvl) { upd_task_disp(task, s); }
		}
	}
	*/
}

/* Sets a task to valid. */
function set_task(x) {
	all_tasks[x].valid = true;
}

/* Updates the display of a task based on the slayer level. */
function upd_task_disp(task, s) {
	var valid = (task.count > 0 && s >= task.reqt);
	
	document.getElementById(task.name).style.display = valid ? "inline-block" : "none";
}

/* Validates the form, and gives the output if it's valid. */
function validate() {
	var i, task, rv = true, msg = "";
	
	if (!v_s_lvl) {
		document.getElementById("s_lvl_in_drop").className = "simple_data dropdown";
		document.getElementById("s_lvl_in").style.background = "#ffa8a8";
		msg += "Please enter a valid slayer level.\n";
		rv = false;
	}
	
	if (!v_cmb_lvl) {
		document.getElementById("cmb_lvl_in_drop").className = "simple_data dropdown";
		document.getElementById("cmb_lvl_in").style.background = "#ffa8a8";
		msg += "Please enter a valid combat level.\n"
		rv = false;
	}
	
	if (!v_num_blocks) {
		msg += "Please enter the number of block slots you have.\n";
		rv = false;
	}
	
	msg += "\n";
	
	if (num_masters == 0) {
		msg += "Please select at least one master.\n";
		rv = false;
	} else {
		for (i = 0; i < all_tasks.length; i++) {
			task = all_tasks[i];
			if (task.count > 0 && !task.valid) {
				msg += "Please fill in info for " + task.name + ".\n";
				rv = false;
			}
		}
	}
	
	if (!rv) {
		alert(msg);
	}
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
			'<span>' + alg() + '</span>' +
		'</body>' +

		'</html>');
}
