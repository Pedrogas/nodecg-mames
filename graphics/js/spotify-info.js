'use strict';
const spBundle = "ncg-spotify";
const _spotify = nodecg.Replicant('currentSong', spBundle);
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const songAlbum = document.getElementById("song-album");

_spotify.on('change', value => {
	songName.innerHTML = value.name;
	songArtist.innerHTML = value.artist;
	songAlbum.src = value.albumArt;
});