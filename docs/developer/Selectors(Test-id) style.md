Selector style in the HTML elements:

[data-testid="Page name/Page Element"]

Examples: ![telegram-cloud-photo-size-2-5393406380704122641-y](https://user-images.githubusercontent.com/95026747/216106913-c8732550-0df4-4853-aced-d3c8a07692fb.jpg)

1. [data-testid=""] - Is the element attribute

2. "Page name" - Is a name of a page where the element is.
   Examples:
     * Home page - [data-testid="Home/Page Element"]
     * Import Account - [data-testid="Import Account/Page Element"]

3. "/" - Is a separator between page name and page element. No spaces before and after the slash.
   Examples:
     * Wrong - [data-testid="Home /Page Element"]
     * Wrong - [data-testid="Home/ Page Element"]
     * Wrong - [data-testid="Home / Page Element"]
     * True - [data-testid="Page name/Page Element"]

4. "Page Element" - Is a name of a page element where the element is.
   Examples:
     * Import Account Button - [data-testid="Page name/Import Account Button"]
     * Delegate Tab - [data-testid="Page name/Delegate Tab"]
     * Private Key Input Field - [data-testid="Page name/Private Key Input"]
     
     
     Full example: [data-testid="Accounts Drop Down/Settings Button"]
