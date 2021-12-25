const request = require('request');
const fs = require('fs');
const path = require('path');
// const STORE_NAME = 'HALAL';
const STORE_NAME = 'Halal';

const {nanoid} = require('nanoid');

const generateImageId = () => {
  // Generate unique IDs
  // 11 characters
  // ~139 years needed, in order to have a 1% probability of at least one collision.
  return nanoid(11);
};

const createCategory = (
  categoryName,
  marketId,
  parentId = 0,
  isLastSub = false
) => {
  var request = require('request');
  var options = {
    method: 'POST',
    url: 'http://localhost:8888/FT%20Backend/public/api/categories/store',
    formData: {
      name: `${categoryName}`,
      description: `${categoryName} Description`,
      market_id: marketId,
      parent_id: parentId,
      last_sub_category: `${isLastSub}`,
    },
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response) {
      if (error) {
        reject(error);
        throw new Error(error);
      } else {
        let body = JSON.parse(response.body);
        if (body.success) {
          console.log('£££ CATEGORY CREATED SUCCESSFULLY £££');
          console.log(body);
          resolve(body);
        } else {
          console.log('£££ FAILED TO CREATE CATEGORY £££');
          reject(response);
        }
      }
    });
  });
};

const getDirectories = async (source) =>
  (
    await fs.readdir(source, {
      withFileTypes: true,
    })
  )
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const getStoreId = (storeName) => {
  if (storeName.toUpperCase() === 'TESCO') {
    return 1;
  } else if (storeName.toUpperCase() === 'LIDL') {
    return 2;
  } else if (storeName.toUpperCase() === 'DUNNES') {
    return 3;
  } else if (storeName.toUpperCase() === 'ALDI') {
    return 4;
  } else if (storeName.toUpperCase() === 'HALAL') {
    return 5;
  } else if (storeName.toUpperCase() === 'MR.PRICE') {
    return 6;
  }
};

const downloadImage = async (image) => {
  let imageParts = image.split('/');
  let imageDest = imageParts.pop() || imageParts.pop(); // handle potential trailing slash
  /* Create an empty file where we can save data */
  const file = fs.createWriteStream(`images/${imageDest}`);

  /* Using Promises so that we can use the ASYNC AWAIT syntax */
  return new Promise((resolve, reject) => {
    request({
      /* Here you should specify the exact link to the file you are trying to download */
      uri: image,
      gzip: true,
    })
      .pipe(file)
      .on('finish', async () => {
        resolve(imageDest);
      })
      .on('error', (error) => {
        reject(error);
      });
  }).catch((error) => {
    console.log(`Something happened: ${error}`);
  });
};

const importImage = async (imagePath) => {
  let imageName = imagePath;
  if (imageName === 'Swaad-1-final.png') {
    imagePath = 'Swaad-1-final-min.png';
    imageName = 'Swaad-1-final-min.png';
  } else if (imageName === 'gooseberry.webp') {
    imagePath = 'gooseberry.jpeg';
    imageName = 'gooseberry.jpeg';
  } else if (imageName === 'vic0012.webp') {
    imagePath = 'vic0012.jpeg';
    imageName = 'vic0012.jpeg';
  } else if (imageName === 'resize.webp') {
    imagePath = 'resize.jpeg';
    imageName = 'resize.jpeg';
  } else if (imageName === 'Cycle-Lia-Chandanam.jpg') {
    imagePath = 'Cycle-Lia-Chandanam-working.jpeg';
    imageName = 'Cycle-Lia-Chandanam-working.jpeg';
  } else if (imageName === 'Cycle-Lia-Jas.jpg') {
    imagePath = 'Cycle-Lia-Jas-working.jpg';
    imageName = 'Cycle-Lia-Jas-working.jpg';
  } else if (imageName === 'Cycle-Lia-Prime-Rose.jpg') {
    imagePath = 'Cycle-Lia-Prime-Rose-working.jpeg';
    imageName = 'Cycle-Lia-Prime-Rose-working.jpeg';
  } else if (imageName === 'Haldirams-PaniPuri-360g.jpg') {
    imagePath = 'Haldirams-PaniPuri-360g-working.jpg';
    imageName = 'Haldirams-PaniPuri-360g-working.jpg';
  } else if (imageName === 'Tilda-Golden-Sella-5kg.jpg') {
    imagePath = 'Tilda-Golden-Sella-5kg-working.jpeg';
    imageName = 'Tilda-Golden-Sella-5kg-working.jpeg';
  } else if (imageName === 'TILDA-GRAND-EXTRALONG-BASMATI-5KG.jpg') {
    imagePath = 'TILDA-GRAND-EXTRALONG-BASMATI-5KG-working.jpg';
    imageName = 'TILDA-GRAND-EXTRALONG-BASMATI-5KG-working.jpg';
  } else if (imageName === 'Photo-02-05-2020-13-06-13.png') {
    imagePath = 'bombay-biryani-masala-min.png';
    imageName = 'bombay-biryani-masala-min.png';
  } else if (imageName === 'chings-secret-green-chilli-sauce.jpg') {
    imagePath = 'green-chilli-sauce.jpeg';
    imageName = 'green-chilli-sauce.jpeg';
  } else if (imageName === 'chupa-chups-grape-sparkling-330ml_1024x.jpg') {
    imagePath = 'chupa-chups-grape-sparkling-330ml.jpeg';
    imageName = 'chupa-chups-grape-sparkling-330ml.jpeg';
  } else if (imageName === 'chings-secret-red-chilli-sauce.jpg') {
    imagePath = 'chings-secret-red-chilli-sauce-working.jpeg';
    imageName = 'chings-secret-red-chilli-sauce-working.jpeg';
  } else if (imageName === 'Wai-Wai-Chicken-Noodles-70-G.png') {
    imagePath = 'Wai-Wai-Chicken-Noodles-70-G.jpg';
    imageName = 'Wai-Wai-Chicken-Noodles-70-G.jpg';
  } else if (imageName === '8801073910225_00.jpg') {
    imagePath = 'chives-gvoza-dumpling.jpeg';
    imageName = 'chives-gvoza-dumpling.jpeg';
  } else if (imageName === 'Swaad-3-final.png') {
    imagePath = 'Swaad-3-final-min.png';
    imageName = 'Swaad-3-final-min.png';
  } else if (imageName === '6046000101601378529_1.webp') {
    imagePath = 'NONGSHIM.jpeg';
    imageName = 'NONGSHIM.jpeg';
  }
  let options = {
    method: 'POST',
    url: 'http://localhost:8888/FT%20Backend/public/api/uploads/store',
    headers: {},
    formData: {
      field: 'image',
      uuid: generateImageId(),
      file: {
        value: fs.createReadStream(`images/${imagePath}`),
        options: {
          filename: imageName,
          contentType: null,
        },
      },
    },
  };
  return new Promise(function (resolve, reject) {
    request(options, function (error, response) {
      if (error) {
        reject(error);
        throw new Error(error);
      } else {
        let body = JSON.parse(response.body);
        if (body.success) {
          resolve(response.body);
        } else {
          console.log('FAILED TO IMPORT');
          reject(response);
          throw new Error(response);
        }
      }
    });
  });
};

const importImages = async (image) => {
  let importResArray = [];
  let importStatus = [];
  let imageImportRes;

  let imageDownloadRes = await downloadImage(image);
  imageImportRes = await importImage(imageDownloadRes);
  imageImportRes = JSON.parse(imageImportRes);
  importStatus.push(imageImportRes.success);
  importResArray.push(imageImportRes.data);

  return new Promise(function (resolve, reject) {
    if (!importStatus.includes(false)) {
      resolve(importResArray);
    } else {
      reject('failed');
    }
  });
};

function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

const roundPriceAndExtraCharge = (price, extraCharge) => {
  var newnumber = Math.round((price + extraCharge) * 1e12) / 1e12;
  return parseFloat(newnumber);
};

const importProduct = async (categoryId, marketId, product) => {
  let resImageimport = await importImages(product.image);

  if (resImageimport === 'failed') {
    throw new Error(`Image Import error!`);
  }

  let description = product.Description ? `<p>${product.Description}</p>` : '';
  let images = (json = resImageimport.reduce((json, value, key) => {
    json[`image[${key}]`] = value;
    return json;
  }, {}));
  let price = Number(product.price.replace('€', ''));
  let extraCharge = round(price * 0.1, 1);
  price = roundPriceAndExtraCharge(price, extraCharge);
  let outOfStock = product.outOfStock ? 0 : 1;

  let options = {
    method: 'POST',
    url: 'http://localhost:8888/FT%20Backend/public/api/products/store',
    headers: {},
    form: {
      name: product.name,
      price: price,
      description: description,
      // 'capacity': product.Quantity,
      // 'discount_price': product.SpecialPriceDecimal,
      // 'unit': product.UnitType,
      // 'package_items_count': product.Quantity,
      market_id: marketId,
      category_id: categoryId,
      featured: '1',
      deliverable: outOfStock,
      price_higher: '1',
      ...images,
    },
  };

  return new Promise(function (resolve, reject) {
    request(options, function (error, response) {
      if (error) {
        reject(error);
        throw new Error(error);
      } else {
        let body = JSON.parse(response.body);
        if (body.success) {
          console.log(`IMPORT PRODUCT PASS ${body.data.name}`);
          resolve(response.body);
        } else {
          console.log('FAILED TO IMPORT');
          reject(response);
          throw new Error(response);
        }
      }
    });
  });
};

async function runImport() {
  let parentId = 0;
  let storeId = getStoreId('Halal');
  try {
    let dirPath = path.resolve(__dirname, `../Categories/${STORE_NAME}`);
    let folders = await fs.promises.readdir(dirPath);

    // Loop them all with the new for...of
    for (let currentDir of folders) {
      let aParentId;
      let aCategoryId;
      // if (currentDir !== 'World Food') {
      aParentId = await createCategory(currentDir, storeId, '0', false);
      aCategoryId = aParentId.data.id;
      // } else {
      //   aCategoryId = 225;
      // }

      let CurrentDir = path.resolve(__dirname, `${dirPath}/${currentDir}`);
      let CurrentDirPath = await fs.promises.readdir(CurrentDir);
      for (let grandParent of CurrentDirPath) {
        let GrandParent = path.resolve(
          __dirname,
          `${CurrentDir}/${grandParent}`
        );
        // Stat the file to see if we have a file or dir
        const stat = await fs.promises.stat(GrandParent);

        if (stat.isFile()) {
          let file = GrandParent;
          console.log("'%s' is a file.", GrandParent);
          const dirFile = path.resolve(__dirname, `${GrandParent}`);
          let rawProductDs = fs.readFileSync(dirFile);
          let productData = JSON.parse(rawProductDs);
          const products = productData;
          let categoryName = grandParent.replace(/\.[^/.]+$/, '');
          let bParentId;
          let bCategoryId;

          // if (categoryName === 'Oriental') {
          //   bCategoryId = 229;
          // } else {
          bParentId = await createCategory(
            categoryName,
            storeId,
            aCategoryId,
            true
          );
          bCategoryId = bParentId.data.id;
          // }
          for (const product of products) {
            await importProduct(bCategoryId, storeId, product);
          }
        } else if (stat.isDirectory()) {
          let bParentId;
          // if (grandParent !== 'Flour') {
          bParentId = await createCategory(
            grandParent,
            storeId,
            aParentId.data.id,
            false
          );
          // }
          let suFolders = await fs.promises.readdir(GrandParent);
          for (const subFolder of suFolders) {
            let categoryName = subFolder.replace(/\.[^/.]+$/, '');

            let cParentId;
            let cCategoryId;

            // if (categoryName === 'Chakki Atta') {
            //   cCategoryId = 127;
            // } else {
            cParentId = await createCategory(
              categoryName,
              storeId,
              bParentId.data.id,
              true
            );
            cCategoryId = aParentId.data.id;
            // }

            let categoryId = cParentId.data.id;
            let dirFile = path.resolve(
              __dirname,
              `${GrandParent}/${subFolder}`
            );
            let rawProductDs = fs.readFileSync(dirFile);
            let products = JSON.parse(rawProductDs);
            for (const product of products) {
              await importProduct(categoryId, storeId, product);
            }
          }
          console.log("'%s' is a directory.", currentDir);
        }
      }
    }
  } catch (e) {
    // Catch anything bad that happens
    console.error("We've thrown! Whoops!", e);
  }
}

module.exports = {
  runImport,
  importProduct,
  importImage,
  generateImageId,
};
