(function(global,$){

	var URL ='./assets/data/lang.json';
	var siteLangs = ["cz","en"];

	var Lang = function(activeLang){
		return new Lang.init(activeLang);
	}

	Lang.prototype = {
		getKeyVal: function(keyVal){
			self = this;
			return function(){
				keyVal = keyVal.trim();
				var result;
				for (var i=0; i <= Lang.data.length-1; i++) {
					if (Lang.data[i].datatag===keyVal) {
						result = Lang.data[i][self.activeLang];
						return result;
					} else {
						result = "";
					}
				}
				return result;
			}();
		},
		switchLang: function(switchToLang){
			self = this;
			var numOfLangEls = $("[data-lang]").length;
			for (var i =0;i<=numOfLangEls-1;i++) {
				var retrievedDataTag = $($("[data-lang]")[i]).data('lang');
				value = LNG$(switchToLang).getKeyVal(retrievedDataTag);
				if (value.trim()!=="") {
					if (value.search("<ph>")>-1) {
						value = value.substr(4,value.length);
						$($("[data-lang]")[i]).attr("placeholder",value);
					} else {
						$($("[data-lang]")[i]).text(LNG$(switchToLang).getKeyVal(retrievedDataTag)).animateCss('pulse');
					}
					$($("[data-lang]")[i]).css("visibility","visible");
				}
			}
		}

	};

	Lang.init = function(activeLang){
		var self = this;
		self.activeLang = activeLang || siteLangs[0];
	}

	Lang.init.prototype = Lang.prototype;
	global.Lang = global.LNG$ = Lang;

	getServerData(URL,function(data){
		Lang.data = data;
		var initLang = $(".lang-switcher>span").text().trim();
		LNG$(initLang).switchLang(initLang);
	});

	function getServerData(url, callbackFunc) {
	var result = $.getJSON(url, function() {
					//console.log( "--- success ---" );
				})
				.done(function(data) {
					console.log( "lang data loaded..." );
					//console.log(data);
					callbackFunc(data);
				})
				.fail(function(jqXHR, textStatus, errorThrown) {
					console.log( "--- error ---" );
					console.log(jqXHR);
				})
				.always(function() {
					//console.log( "complete" );
				});
	};

}(window, jQuery));
