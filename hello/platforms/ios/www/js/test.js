document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    // Now safe to use device APIs
$(document).ready(function() {
  var app = new App();
  app.ListenForButtonClick();
});

}

function App ()
{

}

App.prototype.ListenForButtonClick = function ()
{
    $('.submit-button').click(function()
    {
        $.ajax(
          {
            url: "http://corpsebook.herokuapp.com/create/",
            method: "POST"
          }).done(function (data)
          {
            console.log(data);
          });
    });
}