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
function task_form(i, n, r, m) {
	this.id = i;
	this.name = n;
	this.reqt = r;
	this.masters = m;
	this.count = 0;
	this.valid = false;
}

/* A list of all the tasks. */
var all_tasks = [
	new task_form("ab_spectres", "Aberrant Spectres", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("abyssal_dems", "Abyssal Demons", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("adamant_drags", "Adamant Dragons", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("ankou", "Ankou", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("aviansies", "Aviansies", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("banshees", "Banshees", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("basilisks", "Basilisks", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("bats", "Bats", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("bears", "Bears", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("birds", "Birds", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("black_dems", "Black Demons", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("black_drags", "Black Dragons", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("bloodveld", "Bloodveld", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("blue_drags", "Blue Dragons", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("bosses", "Bosses", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("brine_rats", "Brine Rats", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   false]),	// Duradel
	
	new task_form("bronze_drags", "Bronze Dragons", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("catablepons", "Catablepons", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("cave_bugs", "Cave Bugs", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("cave_crawlers", "Cave Crawlers", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("cave_horrors", "Cave Horrors", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("cave_kraken", "Cave Kraken", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("cave_slimes", "Cave Slimes", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("cockatrice", "Cockatrice", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("cows", "Cows", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("crawling_hands", "Crawling Hands", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("crocodiles", "Crocodiles", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("dagannoth", "Dagannoth", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("dark_beasts", "Dark Beasts", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("desert_liz", "Desert Lizards", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("dogs", "Dogs", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("dust_devils", "Dust Devils", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("dwarves", "Dwarves", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("earth_warrs", "Earth Warriors", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("elves", "Elves", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("fever_spiders", "Fever Spiders", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("fire_giants", "Fire Giants", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("flesh_crawlers", "Flesh Crawlers", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("fossil_wyvs", "Fossil Island Wyverns", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("gargoyles", "Gargoyles", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("ghosts", "Ghosts", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("ghouls", "Ghouls", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("goblins", "Goblins", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("great_dems", "Greater Demons", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("green_drags", "Green Dragons", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("harpie_bugs", "Harpie Bug Swarms", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("hellhounds", "Hellhounds", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("hill_giants", "Hill Giants", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("hobgoblins", "Hobgoblins", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("ice_giants", "Ice Giants", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("ice_warrs", "Ice Warriors", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("icefiends", "Icefiends", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("infernal_mages", "Infernal Mages", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("iron_drags", "Iron Dragons", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("jellies", "Jellies", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("jungle_horrs", "Jungle Horrors", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("kalphites", "Kalphites", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("killerwatts", "Killerwatts", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("kurasks", "Kurasks", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("less_dems", "Lesser Demons", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("lizardmen", "Lizardmen", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("minotaurs", "Minotaurs", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("mithril_drags", "Mithril Dragons", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("mogres", "Mogres", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("molanisks", "Molanisks", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("monkeys", "Monkeys", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("moss_giants", "Moss Giants", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("mutated_zygs", "Mutated Zygomites", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("nechryael", "Nechryael", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("ogres", "Ogres", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("otherworldly_beings", "Otherworldly Beings", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("pyrefiends", "Pyrefiends", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("rats", "Rats", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("red_drags", "Red Dragons", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel

	new task_form("rockslugs", "Rockslugs", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("rune_drags", "Rune Dragons", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("scabarites", "Scabarites", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   false]),	// Duradel
	
	new task_form("scorpions", "Scorpions", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("sea_snakes", "Sea Snakes", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("shades", "Shades", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("shadow_warrs", "Shadow Warriors", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("skeletal_wyvs", "Skeletal Wyverns", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("skeletons", "Skeletons", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("smoke_devils", "Smoke Devils", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("spiders", "Spiders", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("spirituals", "Spiritual Creatures", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("steel_drags", "Steel Dragons", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("suqahs", "Suqahs", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("terror_dogs", "Terror Dogs", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("trolls", "Trolls", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("turoth", "Turoth", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   false]),	// Duradel
	
	new task_form("tzhaar", "TzHaar", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   true,	// Chaeldar
				   true,	// Nieve
				   true]),	// Duradel
	
	new task_form("vampyres", "Vampyres", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("wall_beasts", "Wall Beasts", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   true,	// Mazchna
				   true,	// Vannaka
				   true,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("waterfiends", "Waterfiends", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   true]),	// Duradel
	
	new task_form("werewolves", "Werewolves", 1,
				  [false,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   true,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("wolves", "Wolves", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("zombies", "Zombies", 1,
				  [false,	// Krystilia
				   true,	// Turael
				   true,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_ankou", "Ankou (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_aviansies", "Aviansies (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_bandits", "Bandits (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_bears", "Bears (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_black_dems", "Black Demons (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_black_drags", "Black Dragons (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_bosses", "Bosses (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_chaos_druids", "Chaos Druids (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_dark_warrs", "Dark Warriors (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_earth_warrs", "Earth Warriors (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_ents", "Ents (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_fire_giants", "Fire Giants (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_great_dems", "Greater Demons (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_green_drags", "Green Dragons (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_hellhounds", "Hellhounds (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_ice_giants", "Ice Giants (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_ice_warrs", "Ice Warriors (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_lava_drags", "Lava Dragons (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_less_dems", "Lesser Demons (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_mag_axes", "Magic Axes (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_mammoths", "Mammoths (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_revenants", "Revenants (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_rogues", "Rogues (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_scorpions", "Scorpions (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_skeletons", "Skeletons (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_spiders", "Spiders (Wilderness)", 1,
				  [true,	// Krystilia
				   false,	// Turael
				   false,	// Mazchna
				   false,	// Vannaka
				   false,	// Chaeldar
				   false,	// Nieve
				   false]),	// Duradel
	
	new task_form("w_spirituals", "Spiritual Creatures (Wilderness)", 1,
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

/* Blocks a user from selecting a given master. */
function disable_master(m) {
	var parent = document.getElementById(m),
		checkbox = document.getElementById(m + "_entry");
	
	parent.style.background = "#f73d3d";
	parent.className = "master dropdown_master";
	
	checkbox.className = "simple_data dropdown_check";
	checkbox.disabled = "disabled";
}

/* Allows a user to select a given master. */
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
	
	for (i = 0; i < all_tasks.length; i++) {
		task = all_tasks[i];
		if (task.masters[m]) {
			task.count += (x ? 1 : -1);
			// if (v_s_lvl) { upd_task_disp(task, s); }
		}
	}
}

/* Sets a task to valid. */
function set_task(x) {
	all_tasks[x].valid = true;
}

/* Updates the display of a task based on the slayer level. */
function upd_task_disp(task, s) {
	var valid = (task.count > 0 && s >= task.reqt);
	
	document.getElementById(task.id).style.display = valid ? "inline-block" : "none";
}

function upd_verbosity(v) {
	var ranges = document.getElementsByClassName("range_pref"),
		lits = document.getElementsByClassName("lit_pref"),
		i;
	
	for (i = 0; i < ranges.length; i++) {
		ranges[i].style.display = v ? "none" : "block";
	}
	
	for (i = 0; i < lits.length; i++) {
		lits[i].style.display = v ? "block" : "none";
	}
}

/* Validates the form, and gives the output if it's valid. */
function validate() {
	var i, task, rv = true, msg = "";
	
	if (!v_s_lvl) {
		document.getElementById("s_lvl_in_drop").className = "simple_data dropdown";
		document.getElementById("s_lvl_in").style.background = "#ffa8a8";
		msg += "Please enter a valid slayer level.<br />";
		rv = false;
	}
	
	if (!v_cmb_lvl) {
		document.getElementById("cmb_lvl_in_drop").className = "simple_data dropdown";
		document.getElementById("cmb_lvl_in").style.background = "#ffa8a8";
		msg += "Please enter a valid combat level.<br />"
		rv = false;
	}
	
	if (!v_num_blocks) {
		msg += "Please enter the number of block slots you have.<br />";
		rv = false;
	}
	
	msg += msg === "" ? "" : "<br />";
	
	if (num_masters == 0) {
		msg += "Please select at least one master.<br />";
		rv = false;
	} else {
		for (i = 0; i < all_tasks.length; i++) {
			task = all_tasks[i];
			if (task.count > 0 && !task.valid) {
				msg += "Please fill in info for " + task.name + ".<br /><br />";
				rv = false;
			}
		}
	}
	
	if (!rv) {
		document.getElementById("error").innerHTML = msg;
		document.getElementById("error_popup").style.display = "block";
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
			'<span>' + alg() + '</span>' +
		'</body>' +

		'</html>');
}
