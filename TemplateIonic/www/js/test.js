$(document).ready(function () {

    $("#myHref").click(function () {

        var pdf = new jsPDF('p', 'pt', 'letter');

        var specialElementHandlers = {
            '#printDiv': function (element, renderer) {
                return true;
            }
        };

        pdf.addHTML($('#printDiv').first(), function () {
            pdf.save("rentals.pdf");
        });
    });
});