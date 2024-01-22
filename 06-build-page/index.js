const fs = require('fs/promises');
const path = require('path');

async function assemblePage() {
  // 1 Create project-dist folder
  const distFolder = path.join(__dirname, 'project-dist');
  try {
    await fs.mkdir(distFolder, { recursive: true });
  } catch (err) {
    console.error(`Error creating ${distFolder} folder: ${err.message}`);
    return;
  }

  // 2 Read and save the template file
  const templatePath = path.join(__dirname, 'template.html');
  let templateContent;
  try {
    templateContent = await fs.readFile(templatePath, 'utf-8');
  } catch (err) {
    console.error(`Error reading template file: ${err.message}`);
    return;
  }

  // 3 Find all tag names in the template file and replace tags
  const tagRegex = /{{(.*?)}}/g;
  const tags = templateContent.match(tagRegex) || [];

  // Step 4: Replace template tags with content of component files
  for (const tag of tags) {
    const componentName = tag.replace('{{', '').replace('}}', '');
    const componentPath = path.join(__dirname, 'components', `${componentName}.html`);

    // Check if the component file exists
    try {
      await fs.access(componentPath);
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      templateContent = templateContent.replace(tag, componentContent);
    } catch (err) {
      console.error(`Error: Component file '${componentName}.html' not found.`);
    }
  }

  // Step 5: Write modified template to index.html in project-dist folder
  const indexPath = path.join(distFolder, 'index.html');
  try {
    await fs.writeFile(indexPath, templateContent);
  } catch (err) {
    console.error(`Error writing to index.html: ${err.message}`);
    return;
  }

  // Step 6: Compile styles from styles folder into style.css
  const stylePath = path.join(distFolder, 'style.css');
  try {
    // Use your own logic for merging styles here (as it's not provided)
    // For simplicity, let's assume a basic concatenation.
    const stylesContent = await concatenateStyles(path.join(__dirname, 'styles'));
    await fs.writeFile(stylePath, stylesContent);
  } catch (err) {
    console.error(`Error compiling styles: ${err.message}`);
    return;
  }

  // Step 7: Copy assets folder into project-dist folder
  const assetsPath = path.join(distFolder, 'assets');
  try {
    await copyDirectory(path.join(__dirname, 'assets'), assetsPath);
  } catch (err) {
    console.error(`Error copying assets: ${err.message}`);
    return;
  }

  console.log('Page assembly completed successfully.');
}

// Helper function to concatenate styles from files in a given folder
async function concatenateStyles(stylesFolderPath) {
  const stylesFiles = await fs.readdir(stylesFolderPath);
  const stylesContentArray = await Promise.all(
    stylesFiles.map(async (file) => {
      const filePath = path.join(stylesFolderPath, file);
      return await fs.readFile(filePath, 'utf-8');
    })
  );
  return stylesContentArray.join('\n');
}

// Helper function to copy a directory and its contents
async function copyDirectory(source, destination) {
  try {
    await fs.mkdir(destination, { recursive: true });
  } catch (err) {
    console.error(`Error creating directory ${destination}: ${err.message}`);
    return;
  }

  const files = await fs.readdir(source);

  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);

    const stat = await fs.stat(sourcePath);

    if (stat.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath);
    } else {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
}

assemblePage();
