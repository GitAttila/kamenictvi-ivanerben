function initContactFormListener() {
    
    //console.log("inside of a function InitFormListener");
    
    $("#contact-form .btn-site").on( "click", function() {
        //console.log("click event: .contact-submit button");
        $( "#contact-form" ).submit();
    });

    $("#contact-form").submit(function(e) {
        e.preventDefault();

        console.log("Form submitted listener called");

        var inputElements = $("#contact-form").find('input, textarea, select');
        var formValues = {};

        inputElements.each(function() {
            if (this.name) {
                if (this.type == "checkbox" || this.type == "radio") {
                    if (this.checked) {
                        formValues[this.name] = this.value;
                    }
                }else {
                    formValues[this.name] = this.value;
                }
            }
        });
        
        console.log("formValues : " + JSON.stringify(formValues));

        $.ajax({
            url: "assets/php/handleajaxform.php",
            method: "POST",
            data: formValues,
            success: function(result) {

                console.log("AJAX post result result : " + JSON.stringify(result));

                $('div[data-error-id]').text("");
                $('#contact-form input, #contact-form textarea').removeClass('form-error');
                $('#send-result').text("");

                if (Object.keys(result.errors).length > 0) {
                    for (var inputName in result.errors) {
                        console.log("error in " + inputName + ": " + result.errors[inputName]);

                        $('div[data-error-id="' + inputName + '"]').text(result.errors[inputName]).hide().slideDown();
                        $('*[name="' + inputName + '"]').addClass('form-error');
                        $('*[name="' + inputName + '"]').animateCss('shake');
                    }
                }else {
                    console.log("All validation passed succesfully!");

                    $("#send-result").text("Thank you. Your message has been sent.");
                    $("#send-result").removeClass('alert-danger').addClass('alert-success');
                    
                    $("#send-result").show().animateCss('bounceIn', function(){
                        $('input').val("");
                        $('textarea').val("");
                        $("#send-result").delay(5000).slideUp();
                    });
                }
            },
            error: function() {
                $("#send-result").removeClass('alert-success');
                $("#send-result").addClass('alert-danger');
                $("#send-result").text("Sorry... Your message could not have been delivered.");
                $("#send-result").slideDown();

            }
            
        });  // the end of ajax call to post formValues
    }); // the end of form submit function
    
    //global.initContactFormListener = initContactFormListener();

};