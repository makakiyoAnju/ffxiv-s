/*	
	main functions will be placed here to prevent duplicate codings
*/

// Updates the overlay dealing mainly with handle.png image so you can resize the context
document.addEventListener("onOverlayStateUpdate", function (e) {
	if (!e.detail.isLocked) {
		document.documentElement.classList.add("resizeHandle");
	} else {
		document.documentElement.classList.remove("resizeHandle");
	}
});