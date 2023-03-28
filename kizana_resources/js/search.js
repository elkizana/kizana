function search() {
  let i = 1;
  let booksSearched = 0;
  console.time("label");

  // Remove Tashkeel (diacritics) from search input value
  const search_input_value = $("#first_search_input").val().removeTashkel();

  // Remove existing table rows
  $("td").remove();

  // Create table header
  $("#search_block_4").html("<table class=search_table><tr><th></th><th>الموجود</th><th>الكتاب</th><th>ص</th><th>ج</th></tr></table>");

  // Display search status message
  $("#progress_status").html("0 / " + books_to_search.length);

  // Map over each book and create a promise for each one
  const promises = books_to_search.map(book => {
    const book_name = book[0];
    return knex_all
      .select("content", "page", "part", "id")
      .from(book[1])
      .then(results => {
        // Map over each result and create a table row for each one that matches the search input
        const tableRows = results
          .map(row => {
            const content_raw = row.content.removeTashkel();
            const index = content_raw.indexOf(search_input_value);
            if (index !== -1) {
              // Highlight the search input in the output
              const output =
                content_raw.slice(Math.max(0, index - 30), index) +
                "<span id=found_word> " +
                search_input_value +
                "</span>" +
                content_raw.slice(index + search_input_value.length, index + search_input_value.length + 60);
              return `<tr><td>${i++}</td><td class="${book[1]}" id="${row.id}">${output}</td><td>${book_name}</td><td>${row.page}</td><td>${row.part || ""}</td></tr>`;
            } else {
              return "";
            }
          })
          .join("");
        return tableRows;
      })
      .catch(() => "")
      .finally(() => {
        booksSearched++;
        $("#progress_status").html(booksSearched + " / " + books_to_search.length);
      });
  });

  // Wait for all promises to resolve before appending table rows to the table
  Promise.all(promises).then(tableRowsArray => {
    const tableRows = tableRowsArray.join("");
    $(".search_table").append(tableRows);
    console.timeEnd("label");

    // Display search status message
    $("#progress_status").html(`المعثور ${i - 1} `);

    // Delegate a click event to the table rows
    $(".search_table").on( "click", "td:nth-child(2)" , function() {
      add_book_and_tab($(this).next().text(), this.className.slice(1), (initial_rowid = this.id));
      setTimeout(() => {
        $(".content:last").text($(".content:last").text().removeTashkel());

        // Highlight the search input in the content and hashia
        $(`.content:last:contains(${search_input_value}), .hashia:last:contains(${search_input_value})`).html(function(_, html) {
          return html.split(search_input_value).join(`<span class='found_single_word'>${search_input_value}</span>`);
        });
      }, 500);
    });
  });
}
