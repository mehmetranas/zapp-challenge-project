//TODO  add validation for delete record


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
        // TODO make visible on mobile
        createSidebar: function(callback){
            // create sidebar div
            // TODO fix sidebar on wide screen
            var sidebar = mycz.ele.div('sidenav bg-f8','','');

            // create add customer button 
            // TODO add success button
            var callback_new_customer = (form,data) => {
                steps.saveToLocalStorage(data);
                steps.updateCustomersTable(data,true);
                form.close()
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
        createHeader: function(callback){
            var label = mycz.ele.label('100%',"Customer Process",'','bg-f3 f-22 center-items text-center','')
            container.append(label);
        },

        // create main div
        createMain: function (callback) {
            var main = mycz.ele.new('div','','main','');
            container.append(main);
            callback();
        },
        
        // TODO add validation
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
                    callback(f,data);
                }

            },isEdit);

            f.show();

        },

         /**
         * Update table after any action
         * @param data object, new data for table or delteing data for update table
         * @param actionType action type for table refresh for new record or editing table etc. (edit,delete,add) 
         */
        updateCustomersTable: function (data,actionType) {console.log(data);
            if(!mycz.helpers.isset(actionType,true,true)) return;

            var checkData = mycz.helpers.isset(data,true,true);
            if(!checkData) return;

            switch (actionType) {
                case 'add':
                    var tr = mycz.ele.tr('',data,
                    {'edit':true,'delete':true,'callback': function (item) {
                        if(item.type === 'edit') {
                            alert('edit');
                        } else if(item.type === 'delete') {
                            alert('delete')
                        }
                    }}
                  );
                $('#customers-table').append(tr);
                    break;
                case 'edit':
                    alert('edit');
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
        },

        // TODO check if local storage has available size
        // TODO add success message after saving
        saveToLocalStorage: function (data) {
            var key = random.productKey();
            data.key = key;
            var storegeData = mycz.storage.get('customers');
            var customers = mycz.helpers.isset(storegeData,true,true) ? JSON.parse(storegeData) : [];
            customers.push(data);
            mycz.storage.set("customers",JSON.stringify(customers));
        },

        getCustomers: function (params) {
          return JSON.parse(mycz.storage.get('customers'));
        },

        showCustomersTable: function (customers) {
            var customersTable = mycz.ele.table('',true,
                    'All Customers',
                    ['Company Name','Customer Name'],
                    customers,
                    {'edit':true,'delete':true,'callback': function (item) {
                        if(item.type === 'edit') {
                            
                        } else if(item.type === 'delete') {
                            steps.deleteCustomer(item.data, function () {
                                steps.updateCustomersTable(item.data,'delete');
                            });
                        }
                    }},
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
            // mycz.storage.set('customers',JSON.stringify(result));
            if(mycz.helpers.isFunction(callback))
            callback(result);
          } catch (error) {
             console.log(error); 
          }
        }
    };

    steps.createSidebar(function(){
        steps.createHeader();
    });
    steps.createMain(function () {
        var customers = steps.getCustomers();
        steps.showCustomersTable(customers);
    })

});


