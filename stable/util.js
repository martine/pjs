// generated by pjs -- do not edit
function assoc(list, key) {
  for (var i = 0;
    (i < list.length); ++(i)) {
    var e = list[i];
    if ((e[0] == key)) {
      return e[1];
    }
  }
  throw ("no '" + key + "' in list");
};
(exports.assoc = assoc);