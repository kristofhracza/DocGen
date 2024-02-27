# DocGen
The poor man's documentation platform

## What is this?
DocGen converts MD files to HTML whilst placing them into an environment that is suitable for web hosting.

## Setup
First, you're going to have to edit the `PUBLIC_FOLDER` variable in `.env` *(unless you're happy with the default name)*.
This will be your main folder for the website

Though keep in mind, that if you change `PUBLIC_FOLDER`, you're going to have to change the name of the `site` folder.

1. Download dependencies `pip install -r requirements.txt`
2. If you need any more assets linked, make sure to edit
    ```python
    # Edit this if you need more
    ASSESTS = '''
    <link rel="stylesheet" href="{0}assets/style.css">
    <link rel="stylesheet" href="{0}assets/prism.css">
    <script type="text/javascript" src="{0}assets/prism.js"></script>
    '''
    ```
    this part of the python code.
3. Move your `.md` files to this project, they don't have to be in a folder, but the structure is much nicer if they are.
4. Setup `SUMMARY.json` according to your `.md` file structure *(more on that later)*
5. Run `docgen.py`, and if everything is fine, your files should be converted and added to `PUBLIC_FOLDER`.

### SUMMARY.json
In this file you will write the structure of your files.

#### Example
```json
{
    "README":"md/README.md",
    "First":{
        "Sub-heading":{
            "MAIN":"some/path/to/md/file",
        },
    },
    "Second":{
        "Feature one":"some/path/to/md/file",
        "Feature two":"some/path/to/md/file"
    }
}
```
The example above would produce following structure:
- README
- First
    - Sub-heading
- Second
    - Feature one
    - Feature two

The entries labeled as `MAIN` should be files that describe the sub-heading.      
For example a sub-heading called *Intro* will have a `MAIN` as opposed to adding another entry below it that would hold the content for *Intro*          
For top-level headings such as `First` or `Second` there cannot be a `MAIN`, they would have to be added to a sublist.

**WRONG WAY**
```json
{
    "Second":{
        "MAIN":"some/path/to/md/file",
    }
}
```

**RIGHT WAY**
```json
{
    "Second":{
        "Sub-heading": {
            "MAIN":"some/path/to/md/file",
        }
    }
}
```
*Yes, this is more of a bug than a feature, but it can be worked on later*


## PUBLIC_FOLDER structure
Any file that is in the `PUBLIC_FOLDER` directory has a purpose.

They can be edited or even deleted, but be aware that their modification or deletion could result in an error / bug.


## PrismJS
For code highlight I've used `PrismJS`.

The `prism.js` file in the `assets` folder, is from an [online generator](https://prismjs.com/download.html#themes=prism&languages=markup+css+clike+javascript).        
However, the `prism.css` file is taken from [Github](https://github.com/PrismJS/prism-themes/blob/master/themes/prism-one-dark.css), the theme is *One Dark*.

## How does all the content get rendered?
This is a very janky soultion, but in the `index.html` file there's an `iframe` element.        
When a list element in the sidebar is clicked, it has a corresponding link and will add that to the `iframe`.
```js
if (isMain === false) newText.onclick = () => {
    document.getElementById("page-render").src = url;
    document.title = "DocGen " + text;
    localStorage.setItem("lastPage",url)
}
```
The last page will be saved to local storage, and will be rendered upon re-freshing or re-opening the page.

### LINKS.json
You don't have to worry about that, it's just output from `docgen.py` that will be used in `loader.js`