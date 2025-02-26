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
            const normalized_search = search_input_value.trim().replace(/\s+/g, " "); // Normalize spaces
            const search_regex = new RegExp(normalized_search.replace(/ /g, ".*?"), "i"); // Create a regex for flexible searching

            const content_raw = row.content.removeTashkel();
            const match = content_raw.match(search_regex);

            if (match) {
              const match_raw_text = match[0]; // Matched text from content_raw
              const index = content_raw.indexOf(match_raw_text); // Get index in content_raw

              // Find the corresponding match in the original content
              const match_text = row.content.slice(index, index + match_raw_text.length);

              // Extract surrounding context from the original row.content
              const before = row.content.slice(Math.max(0, index - 30), index);
              const after = row.content.slice(index + match_text.length, index + match_text.length + 60);

              // Highlight the match in the output
              const output = `${before}<span id="found_word">${match_text}</span>${after}`;

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
    //console.timeEnd("label");

    // Display search status message
    $("#progress_status").html(` عدد النتائج ${i - 1} `);

    // Delegate a click event to the table rows
    $(".search_table").on("click", "td:nth-child(2)", function () {
      add_book_and_tab($(this).next().text(), this.className.slice(1), (initial_rowid = this.id), true);
      setTimeout(() => {
        $(".content:last").text($(".content:last").text().removeTashkel());


        // Highlight the search input in the content and hashia
        $(`.content:last:contains(${search_input_value}), .hashia:last:contains(${search_input_value})`).html(function (_, html) {
          return html.split(search_input_value).join(`<span class='found_single_word'>${search_input_value}</span>`)



        });
      }, 500);

      /*     setTimeout(() => {
            document.querySelector(`.found_single_word`).scrollIntoView({block: "center" });
          }, 1000); */

    });
  });
}
