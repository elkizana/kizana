async function search() {                                         // Search 
    let i = 1
    console.time('label')
  //  $("#b001").animate({ scrollTop: 500 }, 1000);
    let search_input_value = $("#first_search_input").val().removeTashkel()
  
    $("td").remove()
  
    $("#search_block_4").html("<table class=search_table><tr><th></th><th>الموجود</th><th>الكتاب</th><th>ص</th><th>ج</th></tr></table>")
  
    for (book of books_to_search) {
  
      book_name = book[0]
  
  
      await knex_all.select("content", "page", "part", "id").from(book[1]).then(function (results) {
  
        for (row of results) {
          $("#progress_status").html((books_to_search.indexOf(book) + 1) + "/" + books_to_search.length)
          let content_raw = row.content.removeTashkel()
          
          if (content_raw.includes(search_input_value)) {
            index = content_raw.search(search_input_value)
            output = content_raw.split(search_input_value)[0].slice(-60) + "<span id=found_word> " + search_input_value + "</span>" + content_raw.split(search_input_value)[1].slice(0, 60)
            $(".search_table").append(`<tr>    <td> ${i++} </td>    <td  class="${book[1]}" id="${row.id}" > ${output} </td>     <td>  ${book_name}  </td>      <td>  ${row.page}  </td>     <td>  ${row.part || ""}  </td>   </tr> `)
            $("." + book[1] + ":last").on("click", function () { add_book_and_tab($(this).next().text(), this.className.slice(1), initial_rowid = this.id) 
            
              setTimeout(() => {
                $(".content:last").text($(".content:last").text().removeTashkel())
                
                $(`.content:last:contains(${search_input_value}) , .hashia:last:contains(${search_input_value})` ).html(function(_, html) {
                //$(".content:last:contains(قال)").html(function(_, html) {
                  return html.split(search_input_value).join(`<span class='found_single_word'>${search_input_value}</span>`);
              })
              }, 500);
            
            
            })
        
          }
  
          else { null }
        }
  
  
      }, function (error) { null }
  
      )
  
    }
    console.timeEnd('label') 
  }



  