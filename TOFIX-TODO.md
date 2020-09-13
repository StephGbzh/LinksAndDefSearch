# TOFIX TODO

:heavy_check_mark: On page load, the search field is empty and no results are shown. When searching then clearing the search field, all results are shown. They should not.

:heavy_check_mark: keyboard shortcut ESC = "clear" to remove all text and results

:heavy_check_mark: ESC then a valid letter => nothing is found when there should be some results

:heavy_check_mark: Handle any and all fields in data.js dynamically

:heavy_check_mark: Specify fields type in data.js and display their value accordingly

:heavy_check_mark: Show a full page of results when no search string is entered

:heavy_check_mark: Limit number of results shown at once (+ pagination)

:heavy_check_mark: Add possibility to add boost to fields

:heavy_check_mark: Make the page mobile friendly (for now the font is too small and evrything is packed on the left)

:x: Minify main js file ? No, the size is ridiculous compared to the minified react-dom js (9 kB vs 116 kB)

:heavy_check_mark: Rename project: simple search page for custom data

:heavy_check_mark: Search bar always visible even when scrolling

:heavy_check_mark: Clear button in/over the input (an "X")

:heavy_check_mark: Search bar too wide on mobile

:x: Remove React => Vue.js, Svelte ? No framework ? (and bring back minify subject...) => no need for now

:heavy_check_mark: Dark theme

:heavy_check_mark: Test with more data => 760 elements

:heavy_check_mark: Make list elements unwrappable => the colored square and text must stay on the same line

:heavy_check_mark: Fetch data from elsewhere => e.g. urls on github

:heavy_check_mark: Take boost param into account

:heavy_check_mark: Make possible to switch between datasets

- already possible by changing the url <https://stephgbzh.github.io/customta/?json=https://github.com/StephGbzh/customta/raw/master/data.json>
- let's keep the options/settings at a minimum, none as of now being ideal

:black_square_button: Filter, scroll down, load more, scroll down again then modify the search => the list is reduced back to the default results count but we should also scroll back up to the top of the page

:black_square_button: Switch theme light <-> dark

:black_square_button: Test with even more data => tens of thousands elements and files > 10 MB

:black_square_button: Order by fields: numeric, alphanumeric

<!--
Markdown emojis:
:white_large_square: :heavy_check_mark: :x: :black_square_button:
-->
