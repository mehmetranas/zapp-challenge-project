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

    collapsedMenu = function () {
        var display = $(".sidenav").css('display');
        if(display === 'none')
            $(".sidenav").css('display','flex');
        else
            $(".sidenav").css('display',"none")
    }

    checkDataIsEmptyOrNot = function () {
        var customers = getCustomers();
        var messageDiv = $(".my-alert-main");
        var main = $('.main');
        if(!mycz.helpers.isArray(customers) || customers.length <= 0) {
            if(mycz.helpers.isset(main,true,true)){
                main.hide();
                messageDiv.show()
            }
        }else {
            var messageDiv = $(".my-alert-main");
            if(mycz.helpers.isset(messageDiv,true,true)){
                messageDiv.hide();
                main.show()
            }
        }
    }

    // Show a message in main div and prevent to render customer table
    var emptyDataMessage = function () {
        var messageMainDiv = mycz.ele.div('my-alert-main','',{});
        var messageDiv =  mycz.ele.div('my-alert-message','',{});
        var message =  mycz.ele.new('h4','There is not any record','color-dark',{});
        messageDiv.append(message);
        messageMainDiv.append(messageDiv);
        container.append(messageMainDiv)
    
    };

    // return an empty array if there is not any valdation errors
    var checkFormData = function (data) {
        var messages = [];
        var customerNameValidationMessage = mycz.helpers.isset(data.customer_name.trim(),true,true) ? false : "Customer Name";
        var companyNameValidationMessage = mycz.helpers.isset(data.company_name.trim(),true,true) ? false : "Company Name";
        if(customerNameValidationMessage) {
            messages.push(customerNameValidationMessage)
        };
        if(companyNameValidationMessage) {
            messages.push(companyNameValidationMessage)
        }
        return messages;
    }

    // Buttons option for table
    var buttonsCallback = function () {
        return {'edit':true,
                'delete':true,
                'callback': function (item) {
                    if(item.type === 'edit') {
                        steps.newCustomer(item.data,saveOrUpdateCustomer)
                    } else if(item.type === 'delete') {
                        var model = mycz.modal.templates.are_you_sure(() => {
                            steps.deleteCustomer(item.data, function () {
                                steps.updateCustomersTable(item.data,'delete');
                            });
                            model.close();
                        });

                    }
            }
        }
    };

    var saveOrUpdateCustomer = function (form,customer) {
            var isEdit = mycz.helpers.isset(customer.key) ? true : false;
            upadateOrSaveLocalStorage(customer,isEdit,form);
        }

    // TODO check if local storage has available size
    upadateOrSaveLocalStorage = function (data,isEdit,form) {
        var actionType = isEdit ? 'edit' : 'add';
        var storegeData = mycz.storage.get('customers');
        var customers = mycz.helpers.isset(storegeData,true,true) ? JSON.parse(storegeData) : [];
        if(isEdit) {
            var index = customers.findIndex((c) => c.key === data.key);
            if(index < 0) return;
            customers[index] = data;
        } else{
            var key = random.productKey();
            data.key = key;
            customers.push(data);
        }
        try {
            mycz.storage.set("customers",JSON.stringify(customers));
            form.close();
            steps.updateCustomersTable(data,actionType)
        } catch (error) {
            console.log(error);
            mycz.modal.templates.with_icon('Ooppss','Something went wrong.','ion-android-alert')
            
        }
    };

    getCustomers = function () {
        var customers = mycz.storage.get('customers');
        if(!mycz.helpers.isset(customers,true,true))
            return null
        else
            return JSON.parse(customers);
    };

    var steps = {

        /**
         * Creating the sidebar
         * @param callback function - If passed, will be triggered after sidebar is rendered
         */
        createSidebar: function(callback){
            // create sidebar div
            var sidebar = mycz.ele.div('sidenav button-new-dark bg-f8','','');
            var closedButton = mycz.ele.btn('closed-button button-dark','X',collapsedMenu,{});
            var slogan = mycz.ele.div('slogan','Customize Your Customers Easily...Oppsssssss','')
            var customer_add = mycz.ele.btn(
                'button-dark',mycz.ele.icon('ion-person-add','','') +
                ' Add Customer',
                function(){
                    var isMobile = $('.closed-button').display === 'none' ? false : true;
                    if(isMobile) collapsedMenu(); 
                    steps.newCustomer(null,saveOrUpdateCustomer)
                },
                '');
            sidebar.append(closedButton);
            sidebar.append(slogan);
            sidebar.append(customer_add);
            container.append(sidebar);
            callback();
        },
        
        /**
         *
         * @param entries array - An array of entries
         */
        createHeader: function(callback){
            var header = mycz.ele.div('header button-blue','Customers','');
            var button = mycz.ele.btn('button-dark menu-button','☰',collapsedMenu,{});
            header.append(button);
            container.append(header);
        },

        // create main div
        createMain: function (callback) {
            var main = mycz.ele.new('div','','main','');
            container.append(main);
            callback();
        },
         
        newCustomer: function(editData,callback){

            editData = mycz.helpers.isset(editData,true,true) ? editData : '';
            var isEdit = mycz.helpers.isset(editData,true,true);
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

            var f = new mycz.form(isEdit ? 'Update Customer':'New Customer',cols,editData,'',function(data){
                var validationMessages = checkFormData(data);
                if(validationMessages.length > 0) {
                    var validationText = "";
                    validationMessages.forEach(t => {
                        validationText += " <strong>'" + t + "'</strong>" 
                    });
                    mycz.modal.templates.with_icon('Required fields',
                                                    'Please fill these required fields ' + validationText,
                                                    'ion-android-alert')

                } else {
                    if(isEdit) data.key = editData.key
                    if(mycz.helpers.isset(callback,true,true)){
                        for (const key in data) {
                            if (data.hasOwnProperty(key)) {
                                data[key] = data[key].trim(); // trim white space
                            }
                        }
                        callback(f,data);
                    }
                }

            },isEdit);

            f.show();

        },

         /**
         * Update table after any action
         * @param data object, new data for table or delteing data for update table
         * @param actionType action type for table refresh for new record or editing table etc. (edit,delete,add) 
         */
        updateCustomersTable: function (data,actionType) {
            if(!mycz.helpers.isset(actionType,true,true)) return;

            var checkData = mycz.helpers.isset(data,true,true);
            if(!checkData) return;

            switch (actionType) {
                case 'add':
                  var tr = mycz.table.tr('',data,buttonsCallback());
                  tr.css({'opacity':'0'});
                  tr.addClass('button-new-green');
                  $('#customers-table').append(tr);
                  tr.animate({
                      opacity: 1
                  }, 700, () => {
                     setTimeout(() => tr.removeClass("button-new-green"),2300)
                  })
                    break;
                case 'edit':
                        var tr = mycz.table.tr('',data,buttonsCallback());
                        tr.css({'opacity':'0'});
                        tr.addClass('button-new-blue');
                        $('#' + data.key).replaceWith(tr)
                        tr.animate({
                            opacity: 1
                        }, 900, () => {
                           setTimeout(() => tr.removeClass("button-new-blue"),2300)
                        })
                    break;
                case 'delete':
                        var element = $('#' + data.key);
                        $(element)
                            .addClass("alert-warning")
                            .fadeOut("400",() => {
                            $(element).remove();
                        })
                    break    
                default:
                    break;
            }
            checkDataIsEmptyOrNot();
        },


        showCustomersTable: function (customers) {
            var customersTable = mycz.table.new('',
                    'All Customers',
                    ['Company Name','Customer Name','Actions'],
                    customers,
                    buttonsCallback(),
                    {'id':'customers-table'});
            var div = mycz.ele.new('div','','customers-table','');
            div.append(customersTable);
            $('.main').append(div);
        },

        deleteCustomer: function (customer,callback) {
          if(!mycz.helpers.isset(customer,true,true)) return;
          
          var data = mycz.storage.get('customers');
          data = JSON.parse(data);
          var index = data.findIndex( i => i.key === customer.key);
          if(index<0) return;
          var result = mycz.helpers.array.removeByIndex(data,index);
          try {
            mycz.storage.set('customers',JSON.stringify(result));
            if(mycz.helpers.isFunction(callback))
            callback(result);
          } catch (error) {
             console.log(error); 
          }
        },

        renderTable: function () {
            var customers = getCustomers();
                steps.createMain(function () {
                    emptyDataMessage()
                    steps.showCustomersTable(customers);
                    checkDataIsEmptyOrNot();
                })
        }
    };

    steps.createSidebar(function(){
        steps.createHeader();
    });
    steps.renderTable();
});