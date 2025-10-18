// ZarCode Interpreter v1.0 (Hybrid)
// Karya: Anjar Irawan
// Fungsi: Menerjemahkan bahasa ZarCode (Indonesia-style) ke JavaScript

(function (global) {
  const dictionary = {
    "fungsi": "function",
    "jk": "if",
    "jt": "else",
    "ambil": "get",
    "kirim": "post",
    "unt": "for",
    "klik": "onclick",
    "tampil": "console.log",
    "skp": "localStorage.setItem"
  };

  function translateZarCode(code) {
    let result = code;
    for (const [z, js] of Object.entries(dictionary)) {
      const regex = new RegExp("\\b" + z + "\\b", "g");
      result = result.replace(regex, js);
    }
    return result;
  }

  global.runZar = function (code) {
    try {
      const jsCode = translateZarCode(code);
      new Function(jsCode)();
    } catch (err) {
      console.error("ZarCode Error:", err);
    }
  };
})(window);
