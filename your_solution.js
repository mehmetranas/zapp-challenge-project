
// Fix for reduced zappter-core
window.languages = {
    activeLang: 'en'
};

// Fix for reduced zappter-core
function label(t){
    return t;
}

// Fix for reduced zappter-core
var loader = {
    start: function(){},
    stop: function(){}
};

// Fix for icon object. (There was not any icon object. But it has been used in many places. ex. form.js line 7372... So I've created an icon object to solve this problem)
var icon = {
    plus_circle:'ion-plus-circled'
}

$(document).ready(function(){

    var container = $("body");

    // Your code goes here.

    var steps = {

        /**
         * Creating the sidebar
         * @param callback function - If passed, will be triggered after sidebar is rendered
         */
        createSidebar: function(callback){
    

            // create sidebar div
            var sidebar = mycz.ele.div('sidenav bg-f8','','');

            // create add customer button 
            var callback_new_customer = (data) => {console.log(data);
                steps.saveToLocalStorage(data);
            }
            var customer_add = mycz.ele.btn(
                'zapp-btn w-100 m-top-40',mycz.ele.icon('ion-person-add','','') +
                ' Add Customer',
                function(){steps.newCustomer(null,callback_new_customer)},
                '');
            sidebar.append(customer_add);
            container.append(sidebar);
            callback();
        },
        
        /**
         *
         * @param entries array - An array of entries
         */
        createHeader: function(entries){console.log("creating label");
            // create sidebar label
            var label = mycz.ele.label('100%',"Customer Process",'','z-index-2 bg-f3 f-22 text-center','')
            container.append(label);
        },

        newCustomer: function(editData,callback){

            editData = mycz.helpers.isset(editData,true,true) ? editData : '';
            var isEdit = mycz.helpers.isset(editData,true,true);console.log("is edişt: ",isEdit);
            var cols = {

                /**
                 * Company Name
                 */
                company_name: {
                    type:'text',
                    new:true,
                    edit:true,
                    label: {
                        en: 'Company Name'
                    },
                    helper: {
                        en: 'Please enter company name'
                    },
                    show_helper:true,
                    formWidth:'100%'
                },
                customer_name: {
                    type: 'text',
                    new: true,
                    edit: true,
                    label: {
                        en: 'Custumer Name'
                    },
                    helper: {
                        en: 'Please enter customer name'
                    },
                    show_helper: true,
                    formWidth: '100%'
                }
            }

            var f = new mycz.form('New Customer',cols,editData,'',function(data){

                if(mycz.helpers.isset(callback,true,true)){
                    callback(data);
                }

            },isEdit);

            f.show();

        },

        // TODO check if local storage has available size
        // TODO add success message after saving
        saveToLocalStorage: function (data) {
           mycz.storage.set(data.company_name,data.customer_name); 
        }

    };

    steps.createSidebar(function(){
        steps.createHeader();
    });

});


