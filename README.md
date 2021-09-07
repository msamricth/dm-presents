# Dr Martens

This is a central repo for development of promotional websites for use with DrMartens CMS

---
## Hybris

 Dr. Martens uses Hybris as a CMS, and it can be easy to make mistakes if you're not careful. Here are some general helpful tips

>  **WARNING**
> - When editing a page, select "Page Info" in the top bar to ensure you're editing the correct page. In some cases hard-coded pop-ups have redirected to the homepage... in which case you'll be editing the homepage may not realize it.

> **THIS IS ALL OUT OF DATE, WILL UPDATE WHEN DM GIVES US INFO** 
- Mark Robinson has a recording of a video call introducing how they use Hybris, you may find that helpful.
- When first logged in there is a "Sites" drop down, you'll want "Dr Martens Official"
- To create a new page you'll have to click into the "pages" link under staging
- When creating a new page you'll want a "Content Page", and to select "Content Page 2 Template"
  - `Name:` Indicates the page title. It will show up as "{name you entered} | Dr. Martens"
  - `Page Label:` Indicates the slug URL to be used for the page. 
  - To view your page after you've synced goto: `https://stage6.dm.projecta.com/us/en/{Page Label}`

- To add your blob of html/css/js you'll want to create a new paragraph component and add it to the page.
- Editing this paragraph component allows you to add the blob as source.
- When you're done, go back out the the list of pages, and find yours. In the "..." menu click "sync". This will only sync to stage6, not to the live site.
- We are using version 6.6 of Hybris in case you need to check the docs.
- Since many of our pages embed vimeo videos which won't load over VPN, you'll find smartedit load times to be horrible. It's a good idea to open multiple tabs and let them load at the same time.


> Vimeo videos will not load while connected to the VPN, stage6 pages will not load while *NOT* connected to the VPN. Here's a workaround:
 1) Load page while connected to VPN.
 2) Disconnect from VPN, then press `r` (this behavior is defined in home.js) to reload all iframes.
 3) You should now see the page with videos loaded. 

---
## Setup & Usage

Run `npm i` in the project directory to install dependencies for building & exporting.

Modify files in the `src/` directory to make changes, and then run `npm run preview` or `npm run export` (see below).

---
## Creating a new page

Duplicate an existing page such as `src/dm-presents-ali-roberto.pug` and modify as needed.

When you want to preview locally, duplicate an existing preview page such as `/src/prview/dm-presents-ali-roberto.pug` and modify to include the correct new page.

All episode pages are inherited from `src/episode.pug`.

Check out the [pug docs](https://pugjs.org/language/attributes.html) for more info.

We are using `gulp-pug` to compile pug into our html/css/js blobs, then `gulp-minify-inline` to minify the blob.

---

## Gulp tasks 

`default` creates files in `build/` which can be hosted locally to get a preview of the content

URLs (such as links) are relative to the domain, so that's why it places previews into `build/us/en/`

`export` exports minified blobs of html/css/js that need to be copy/pasted into Hybris, it places them in `build/hybris/`

We have been delivering those blobs to Bahareh Rezaeian (bahareh.rezaeian@drmartens.com) in the form of a .txt files in a single .zip file for ease of deployment to their live site

**TODO**: Modify `gulp.js` to automatically create that .zip file

---
## Delivery to DrMartens

- Create a .zip of the `build/hybris` folder with the naming structrure of `DMPresents_Hybris_S#E#_D##.M##.Y####.zip` 
  - S for season, E for episode, D for day of month, M for month number, Y for year.
  - For example: `DMPresents_Hybris_S2E0_07.09.2021.zip` is season 2 episode 0, delivered on Sep 7th, 2021. 
  - If you need multiple deliveries per day for bug fixes add a `_v#` to the end to indicate the version.

- Post the .zip in the internal drmartens slack channel
- Coordinate with project lead/manager to deliver .zip for deployment
- So far our contacts for Hybris have been Bahareh (bahareh.rezaeian@drmartens.com), and Uyen (uyen.ochsner@drmartens.com) 