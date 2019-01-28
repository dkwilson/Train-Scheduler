(function($) {
  $(function() {
    $("#trainOutput").hide();
    $("#inputForm").hide();

    $("#getStarted").on("click", function() {
      $("#inputForm").show();
      $("#startImage").hide();
    });

    $("#goTrains").on("click", function() {
      $("#inputForm").hide();
      $("#trainOutput").show();
    });
  }); // end of document ready
})(jQuery); // end of jQuery name space
