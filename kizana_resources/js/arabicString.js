/**
 * The percentage of Arabic letters in the `String`.
 *
 * Example:
 *
 * 		'foobar'.howArabic()
 *		//=> 0.0
 *
 *		'فوو bar'.howArabic()
 *		//=> 0.5
 *
 * 		'فوبار'.howArabic()
 *		//=> 1.0
 *
 *
 * @returns {Float}
 * @api public
 */

String.prototype.howArabic = function () {

	var result, match, str = this

	// strip punctuation, digits and spaces
	str = str.replace(/[\u0021-\u0040\s]/gm, '')

	match = str.match(/[\u0621-\u0652]/gm) || []

	result =  match.length / str.length

	return result;
}

/**
 * The percentage of non-Arabic letters in the `String`.
 *
 * Example:
 *
 * 		'فوبار'.howNotArabic()
 *		//=> 0.0
 *
 *		'فوو bar'.howNotArabic()
 *		//=> 0.5
 *
 * 		'foobar'.howNotArabic()
 *		//=> 1.0
 *
 *
 * @returns {Float}
 */

String.prototype.howNotArabic = function () {

	var result, match, str = this

	// strip punctuation, digits and spaces
	str = str.replace(/[\u0021-\u0040\s]/gm, '')

	match = str.match(/[^\u0621-\u0652]/gm) || []
	
	result =  match.length / str.length

	return result;
}


/**
 * Is the `String` Arabic, based on
 * a given `threshold` between `0` and `1`. Defaults to `0.79`.
 * 
 * Example:
 * 
 *		'فوو'.isArabic()
 *		//=> true
 *		'فوو bar baz'.isArabic(0.5)
 *		//=> flase
 *
 * @param {Float} [threshold=0.79]
 * @returns {Boolean}
 */
	
String.prototype.isArabic = function (threshold) {
	
	threshold = threshold || 0.79

	return this.howArabic() >= threshold;
}

/**
 * Does the `String` have _any_ Arabic letter.
 *
 * Example:
 *
 *		'فوو bar'.hasArabic()
 *		//=> ture
 *		'foo bar'.hasArabic()
 *		//=> false
 *
 *
 * @returns {Boolean}
 */
 
String.prototype.hasArabic = function () {

  return /[\u0621-\u064A]/.test(this);
}

/**
 * Remove the Arabic tashkil -diacritics- from the 'String'.
 *
 * Example
 *
 *		'مٌحمْد'.removeTashkel()
 *		//=> 'محمد'
 *
 *		'وَتُرى الْكَوَاكِبِ فِي الْمَجَرَّةِ شَرَعَا*** مِثْلُ الظِّباءِ كوارعا فِي جَدْوَلِ'.removeTashkel()
 *		//=> 'وترى الكواكب في المجرة شرعا *** مثل الظباء كوارعا في جدول'
 *
 *
 * @returns {String}
 */
 
String.prototype.removeTashkel = function () {
    return this.replace(/[\u064B-\u0652]/g, '') // إزالة التشكيل (الفتحة، الضمة، الشدة، إلخ.)
               .replace(/[أإآ]/g, "ا")  // توحيد جميع أشكال الألف
               .replace(/ة/g, "ه")      // استبدال التاء المربوطة بالهاء
               .replace(/ئ/g, "ى")      // استبدال الياء الهمزية بالياء العادية
               .replace(/ؤ/g, "و")      // استبدال الواو الهمزية بالواو العادية
               .replace(/ٱ/g, "ا")      // استبدال الألف الخنجرية بالألف العادية
               .replace(/ٓ/g, "");      // إزالة علامات المدّ
};



/**
 * Remove non-Arabic letters
 *
 * Example
 *
 *		'hello مرحبا'.removeNonArabic()
 *		//=> 'مرحبا'
 *
 *
 *
 * @returns {String}
 */
 
String.prototype.removeNonArabic = function () {

	return this.replace(/[^\u0621-\u0652]/gm, '');
}

/**
 * Remove Arabic letters
 *
 * Example
 *
 *		'hello مرحبا'.removeTashkel()
 *		//=> 'hello'
 *
 *
 *
 * @returns {String}
 */
 
String.prototype.removeArabic = function () {

	return this.replace(/[\u0621-\u0652]/gm, '');
}
