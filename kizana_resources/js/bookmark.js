var Oktob = oktob()
const os = require('os');


if (  os.type() == "Linux" ) {
  var bookmark_file = os.homedir() + "/.config/الخزانة/bookmark.json" 
  if (!fs.existsSync(os.homedir() + "/.config/الخزانة/bookmark.json" ) ) { 
    fs.writeFile(bookmark_file, '[]', function (err) {null})
    }
  }


else if ( os.type() == "Windows_NT" )  {
  var bookmark_file = os.homedir() + "/app/الخزانة/bookmark.json"
  if ( !fs.existsSync(os.homedir() + "/app/الخزانة/bookmark.json" ) ) { 
  fs.writeFile(bookmark_file, '[]', function (err) {null})
}}

if (  os.type() == "Linux" ) {
  var last_opened = os.homedir() + "/.config/الخزانة/last_opened.json" 
  if (!fs.existsSync(os.homedir() + "/.config/الخزانة/last_opened.json" ) ) { 
    fs.writeFile(last_opened, '[]', function (err) {null})
    }
  }


else if ( os.type() == "Windows_NT" )  {
  var last_opened = os.homedir() + "/app/الخزانة/last_opened.json"
  if ( !fs.existsSync(os.homedir() + "/app/الخزانة/last_opened.json" ) ) { 
  fs.writeFile(last_opened, '[]', function (err) {null})
}}

var knex_all = require("knex")({
  client: "sqlite3",
  connection: {
    filename: path.join(__dirname, '../kizana_all_books.sqlite')
  }
})

var knex_master = require("knex")({
  client: "sqlite3",
  connection: {
    filename: path.join(__dirname, '../index.sqlite')
  }
})

function jsontotable() {      // form html table from json file
  let rawdata = fs.readFileSync(bookmark_file);
let bookmarks_list = JSON.parse(rawdata);
  let i = 1 
      var transform = {"tag":"table", "id" : "bookmark_table" , "children":[
          {"tag":"tr","children":[
              {"tag":"td",'id':"${id}" ,"class" : "bookmarked_book" , "data-page-id" : "${page_id}" , "html": "${name}"  },
              {"tag":"td",'id':"${id}"  , "html": "${page}"  },
              {"tag":"td",'id':"${id}"  , "html": "${part}"  },
              {"tag":"td" , "html": "<p  id=${id} class=remove_book >___</p>"  }
          ]}
    ]}
    $('#bookmark_table').html(json2html.transform(bookmarks_list,transform))
    $('#bookmark_table').prepend('<th></th>  <th>الكتاب</th><th>الصفحة</th><th>الجزء</th><th>إزالة</th>')
    $(".bookmarked_book").each(function(){
      $(this).before  (  '<td>' + i++ +  '</td>' ) 
    });
    $(".bookmarked_book").on("click" , function () {
      add_book_and_tab( $(this).text(), $(this).attr("id") , initial_rowid = $(this).attr("data-page-id")  )
          })

$(".remove_book").on("click" , function () {
  num = $(this).parents("tr").find("td:first").html()
  remove_from_bookmarks(num)
  $(this).parents("tbody").remove()
})

}

function remove_from_bookmarks(num) { 
  
  let rawdata = fs.readFileSync(bookmark_file);
  let bookmarks_list = JSON.parse(rawdata);


bookmarks_list = bookmarks_list.filter(x => x !== bookmarks_list[num - 1 ]);

bookmarks_list = JSON.stringify(bookmarks_list)
fs.writeFileSync(bookmark_file, bookmarks_list ) 

}