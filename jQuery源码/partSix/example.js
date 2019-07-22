function aaa() {
    var dfd = $.Deferred();
    alert(111);
    setTimeout(function(){
        dfd.resolve()
    }, 1000);
    return dfd.promise();
}
var newDfd = aaa();
newDfd.done(function () {
    alert('success');
  }).fail(function () { 
      alert('failure');
   });