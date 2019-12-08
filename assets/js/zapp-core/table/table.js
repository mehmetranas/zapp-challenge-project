mycz.table = {
    /**
 * Create a table
 * @param classes 
 * @param caption string, table caption
 * @param headRowEls array of head row titles
 * @param data array of data objects
 * @param buttons object, allowed buttons and action callback (edit,delete,callback)
 */
  new: function (classes,caption,headRowEls,data,buttons,attributes,callback) {
    var table = $('<table />');
    buttons = mycz.helpers.isset(buttons, true, true) ? buttons : {};
    if(mycz.helpers.isset(classes,true,true)){
        table.attr("class",classes);
    }
  
    if(mycz.helpers.isset(attributes,true,true)){
      $.each(attributes,function(key,v){
          table.attr(key,v);
      })
    }
  
    if(mycz.helpers.isset(caption,true,true)){
      var cp = $('<caption>').html(caption);
      table.append(cp);
    }
  
    if(mycz.helpers.isset(headRowEls,true,true)) {
      var headRow = $('<tr>');
      headRowEls.forEach(function(el) {
        var th = $('<th>', {
            text: el
        })
        headRow.append(th);
      });
      table.append(headRow);
    }
    
    if(mycz.helpers.isArray(data) && data.length > 0) {
      data.forEach(item => {
          var tr = mycz.table.tr('',item,buttons,{});
          table.append(tr);
        });
    }
  
    return table;
  },

  /**
 * Create a table row
 * @param classes 
 * @param data data objects
 * @param buttons object, allowed buttons (edit,delete) 
 * @param attributes additional attributes 
 */
tr: function (classes,data,buttons,attributes) {
    var tr = $('<tr />'), 
        editButton,
        deleteButton,
        callback = mycz.helpers.isFunction(buttons.callback) 
            ? buttons.callback : false;

    if(mycz.helpers.isset(classes)){
        tr.attr("class",classes);
    }

    if(mycz.helpers.isset(attributes)){
      $.each(attributes,function(key,v){
          tr.attr(key,v);
      })
   }
  
   if(mycz.helpers.isset(buttons.edit,true,true)) {
    editButton = mycz.ele.btn('button-blue',
    mycz.ele.icon('ion-edit','',''),
    function () {
        var result = {
            type:'edit',
            data: {}
        };
        $(this).closest('tr').find('td').each(function() {
            var prop = $(this).attr('name');
            var value = $(this).text();
            if (!mycz.helpers.isset(prop)) return;
            result.data[prop] = value;
        });
        if(callback)
        callback(result);
    },{"id":"edit-button","type":"edit"}); 
   }else {
     editButton = false;
   }

   if(mycz.helpers.isset(buttons.delete,true,true)) {
       deleteButton = mycz.ele.btn('button-red',
       mycz.ele.icon('ion-android-delete','',''),
       function () {        
           var result = {
           type:'delete',
           data: {}
        };
        $(this).closest('tr').find('td').each(function() {
            var prop = $(this).attr('name');
           var value = $(this).text();
           if (!mycz.helpers.isset(prop)) return;
           result.data[prop] = value;
        });

        if(callback)
        callback(result)
    },{"id":"delete-button","type":"delete"});
   }else {
     deleteButton = false;
    }
    
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        var td = $('<td>').attr('name',key).text(data[key]);
        tr.append(td);
        if(key === 'id' || key === 'key')
     td.hide()
     
     if(key === 'id' || key === 'key') // Assign an id for tracking this row data any where
     tr.attr('id',data[key]);
    }
  }  
  var tdActions = $('<td>');
  if(editButton)
     tr.append(tdActions.append(editButton));
     if(deleteButton)
     tr.append(tdActions.append(deleteButton));
   return tr;
  },

   /**
 * Create a row only with message text
 * @param classes 
 * @param text
 * @param attributes
 */
  justMessageTr: function (classes,text,attributes) {
    return mycz.table.tr(classes,{'message_text':text},{},attributes);
  }
}