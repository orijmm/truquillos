/* Main jquery functions */

/*$(document).ready(function() {
console.log('holasd');
});*/

$(document).ready(function () {

    var jsonn = {};

    //function open modal popup
    function openModal(title,message){
        $('#modalbody').text(message);
        $('#modaltitle').text(title);
        $('#popupmodal').modal('show');
    }

    //function get term conditions
    function getTermsConditions(termid){
        $.ajax({
            type: 'GET',
            url:'http://189.206.164.251:8083/v1/offers/'+termid,
            dataType: 'json',
            headers: {
                'Authorization': 'Basic ' + btoa('ccexpress' + ':' + '21b67674b8c1a2747f0d01f68afc164a')
            },
            success: function(data){
                //$('#termbody').text(data.translations[0].websiteTerms);
                //$('#termtitle').text('Term and Conditions');
            },
            complete: function(jqXHR){
                if (jqXHR.status == '404' || jqXHR.status == '400' || jqXHR.status == '401' || jqXHR.status == '403') {
                    console.log(jqXHR.statusText);
                    openModal(jqXHR.status,jqXHR.statusText);
                }else{
                    var termandcon = '';
                    var transla = jqXHR.responseJSON.translations;
                    for (var i = 0; i < transla.length; i++) {
                        if (transla[i].language.code == 'en' ) {
                            var termandcon = transla[i].websiteDetails; 
                        }
                    }
                    $('#termbody').text(termandcon);
                    $('#termtitle').text('Term and Conditions');
                }
            }
        });
    }

    //validate certificate
    $('#certificatebutton').click(function () {
        var txcertificate = $('#txcerficate').val();
        $(".se-pre-con").fadeIn("slow");
        $.ajax({
            type: 'GET',
            url: 'http://189.206.164.251:8083/v1/certificates/'+txcertificate,
            dataType: 'json',
            // Specify the authentication header
            // btoa() method encodes a string to Base64
            headers: {
                'Authorization': 'Basic ' + btoa('ccexpress' + ':' + '21b67674b8c1a2747f0d01f68afc164a')
            },
            success: function (data) {
                $('#getcertificate').val(data.certificate);
                $('#idcampainterm').val(data.campaign.callCenter.id);
                console.log('respuestaCertificado:');
                console.log(data);
            },
            complete: function (jqXHR) {
                if (jqXHR.status == '404' || jqXHR.status == '400' || jqXHR.status == '401' || jqXHR.status == '403') {
                    openModal(jqXHR.status,jqXHR.statusText);
                    $(".se-pre-con").fadeOut("slow");
                }else{
                    $('#pricecampain').text(jqXHR.responseJSON.campaign.offer.price);
                    $('#amountcard').val(jqXHR.responseJSON.campaign.offer.price);
                    $('#section1').removeClass('d-none');
                    $('#section1').addClass('d-display');
                    $('#section2').removeClass('d-none');
                    $('#section2').addClass('d-display');
                    $('#section3').removeClass('d-none');
                    $('#section3').addClass('d-display');
                    getTermsConditions(jqXHR.responseJSON.campaign.offer.id);
                    $(".se-pre-con").fadeOut("slow");
                }
            }
        });
    });

    $(document).on('click','#activatebuttoncancun', function(){
        $(".se-pre-con").fadeIn("slow");
        if ($('#checkboxterm').prop('checked')) {
            //create customer
            if ( $('#firstName').val().length === 0 || $('#lastName').val().length === 0 || $('#phone').val().length === 0 ||  $('#email').val().length === 0 ) {
            openModal('Fill all the fields','One or more of the fields are empty');
            $(".se-pre-con").fadeOut("slow");
            } else {
                /*dob = new Date($('#birthdaydate').val());
                var today = new Date();
                var age = Math.floor((today-dob) / (365.25 * 24 * 60 * 60 * 1000));
                //ageRange
                if (age >= 0 && age < 31) {
                    var ageRange = 1;
                } else if (30 > 0 && age < 65) {
                    var ageRange = 2;                
                } else {
                    var ageRange = 3;                
                }
                console.log(ageRange);
                console.log(dob);*/
                //get username
                var email = $('#email').val();
                var username   = email.substring(0, email.lastIndexOf("@"));
                var createCustomer = {
                "firstName": $('#firstName').val(),
                "lastName": $('#lastName').val(),
                "phone": parseInt($('#phone').val()),
                "email": $('#email').val(),
                "userName": username,
                "saleSet": {
                    "certificate": $('#getcertificate').val()
                },
                "ageRange": {
                    "id": 1
                }
            };
            $.ajax({
                type: 'POST',
                url: 'http://189.206.164.251:8083/v1/customers/create',
                data:JSON.stringify(createCustomer),
                contentType: "application/json",
                // Specify the authentication header
                // btoa() method encodes a string to Base64
                headers: {
                    'Authorization': 'Basic ' + btoa('ccexpress' + ':' + '21b67674b8c1a2747f0d01f68afc164a')
                },
                success: function (data) {
                    console.log('respuestaCustomer:');
                    console.log(data);
                },
                complete: function (jqXHR) {
                    if (jqXHR.status == '404' || jqXHR.status == '400' || jqXHR.status == '401' || jqXHR.status == '403') {
                        console.log(jqXHR.statusText);
                        openModal(jqXHR.status,jqXHR.statusText);
                        $(".se-pre-con").fadeOut("slow");
                    }
                }
            });
            $(".se-pre-con").fadeOut("slow");
            }
        }else{
            $(".se-pre-con").fadeOut("slow");
            openModal('You have not Confirm Term and Conditions','You have to read and check the terms and conditions of the campaign');
        }
    });

    //no code
    $('#sincodigo').click(function () {
        $(".se-pre-con").fadeIn("slow");
        $.ajax({
            type: 'GET',
            url: 'http://189.206.164.251:8083/v1/certificates/getfreecertificate',
            dataType: 'json',
            // Specify the authentication header
            // btoa() method encodes a string to Base64
            headers: {
                'Authorization': 'Basic ' + btoa('ccexpress' + ':' + '21b67674b8c1a2747f0d01f68afc164a')
            },
            success: function (data) {
                console.log(data.number);

            },
            complete: function (jqXHR) {
                if (jqXHR.status == '404' || jqXHR.status == '400' || jqXHR.status == '401' || jqXHR.status == '403') {
                    openModal(jqXHR.status,jqXHR.statusText);
                    $(".se-pre-con").fadeOut("slow");
                }else{
                    var freecertificate = jqXHR.responseJSON.number;
                    //query freecertificate
                    $.ajax({
                        type: 'GET',
                        url: 'http://189.206.164.251:8083/v1/certificates/'+freecertificate,
                        dataType: 'json',
                        // Specify the authentication header
                        // btoa() method encodes a string to Base64
                        headers: {
                            'Authorization': 'Basic ' + btoa('ccexpress' + ':' + '21b67674b8c1a2747f0d01f68afc164a')
                        },
                        success: function (data) {
                            $('#getcertificate').val(data.certificate);
                            $('#idcampainterm').val(data.campaign.callCenter.id);
                            console.log('respuestaCertificado:');
                            console.log(data);
                        },
                        complete: function (jqXHR) {
                            if (jqXHR.status == '404' || jqXHR.status == '400' || jqXHR.status == '401' || jqXHR.status == '403') {
                                openModal(jqXHR.status,jqXHR.statusText);
                                $(".se-pre-con").fadeOut("slow");
                            }else{
                                $('#pricecampain').text(jqXHR.responseJSON.campaign.offer.price);
                                $('#amountcard').val(jqXHR.responseJSON.campaign.offer.price);
                                $('#section1').removeClass('d-none');
                                $('#section1').addClass('d-display');
                                $('#section2').removeClass('d-none');
                                $('#section2').addClass('d-display');
                                $('#section3').removeClass('d-none');
                                $('#section3').addClass('d-display');
                                getTermsConditions(jqXHR.responseJSON.campaign.offer.id);
                                $(".se-pre-con").fadeOut("slow");
                            }
                        }
                    });
                }
            }
        });

    });
});
