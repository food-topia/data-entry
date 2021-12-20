const request = require('request');
const fs = require('fs');
const path = require('path');

const {
    nanoid
} = require('nanoid');

const generateImageId = () => {
    // Generate unique IDs
    // 11 characters
    // ~139 years needed, in order to have a 1% probability of at least one collision.
    return nanoid(11);
}

const createCategory = (categoryName) => {
    var request = require('request');
    var options = {
        'method': 'POST',
        'url': 'http://localhost:8888/FT%20Backend/public/api/categories/store',
        formData: {
            'name': `${categoryName}`,
            'description': `${categoryName} Description`
        }
    };
    return new Promise((resolve, reject) => {
        request(options, function (error, response) {
            if (error) {
                reject(error);
                throw new Error(error);
            } else {
                let body = JSON.parse(response.body);
                if(body.success) {
                    console.log('£££ CATEGORY CREATED SUCCESSFULLY £££');
                    console.log(body);
                    resolve(body);
                } else {
                    console.log('£££ FAILED TO CREATE CATEGORY £££')
                    reject(response);
                }
            }
        });
    });
}

const getDirectories = async source =>
    (await fs.readdir(source, {
        withFileTypes: true
    }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)


const getStoreId = (storeName) => {
    if (storeName.toUpperCase() === 'TESCO') {
        return 1
    } else if (storeName.toUpperCase() === 'LIDL') {
        return 2
    } else if (storeName.toUpperCase() === 'DUNNES') {
        return 3
    } else if (storeName.toUpperCase() === 'ALDI') {
        return 5
    } else if (storeName.toUpperCase() === 'HALAL') {
        return 6
    }
}

const getCategoryId = (categoryName) => {
    if (categoryName.toUpperCase() === 'BANANAS') {
        return 1
    } else if (categoryName.toUpperCase() === 'DRINKS') {
        return 2
    } else if (categoryName.toUpperCase() === 'VEGETABLES') {
        return 3
    } else if (categoryName.toUpperCase() === 'FOODS') {
        return 5
    } else if (categoryName.toUpperCase() === 'MEAT') {
        return 7
    } else if (categoryName.toUpperCase() === 'PASTRY') {
        return 8
    }
}

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
                    console.log(`Image Failed to Download`);
                    reject(error);
                });
        })
        .catch((error) => {
            console.log(`Something happened: ${error}`);
        });
}

const importImage = async (imagePath) => {
    let imageName = imagePath;

    let options = {
        'method': 'POST',
        'url': 'http://localhost:8888/FT%20Backend/public/api/uploads/store',
        'headers': {},
        formData: {
            'field': 'image',
            'uuid': generateImageId(),
            'file': {
                'value': fs.createReadStream(`images/${imagePath}`),
                'options': {
                    'filename': imageName,
                    'contentType': null
                }
            }
        }
    };
    return new Promise(function (resolve, reject) {
        request(options, function (error, response) {
            if (error) {
                reject(error);
                throw new Error(error);
            } else {
                let body = JSON.parse(response.body);
                if(body.success) {
                    resolve(response.body)
                } else {
                    console.log('FAILED TO IMPORT')
                    reject(response);
                    throw new Error(response);
                }
            }
        });
    })
}

const importImages = async (images) => {
    let importResArray = [];
    let importStatus = [];
    let imageImportRes;

    for (const image of images) {
        let imageDownloadRes = await downloadImage(image.Original);
        imageImportRes = await importImage(imageDownloadRes);
        imageImportRes = JSON.parse(imageImportRes);
        importStatus.push(imageImportRes.success);
        importResArray.push(imageImportRes.data);
    }

    return new Promise(function (resolve, reject) {
        if (!importStatus.includes(false)) {
            resolve(importResArray);
        } else {
            reject('failed');
        }
    });
}

const importProduct = async (categoryId, marketId, product) => {
    let resImageimport = await importImages(product.Images);

    if (resImageimport === 'failed') {
        throw new Error(`Image Import error!`);
    }

    let description = product.Description ? `<p>${product.Description}</p>` : '';
    let images = json = resImageimport.reduce((json, value, key) => {
        json[`image[${key}]`] = value;
        return json;
    }, {});
    // JSON: images - EG: {'image[0]': 'img456'}
    // Booleans: featured, deliverable, price_higher, images
    let options = {
        'method': 'POST',
        'url': 'http://localhost:8888/FT%20Backend/public/api/products/store',
        'headers': {},
        form: {
            'name': product.Name,
            'price': product.PriceDecimal,
            'discount_price': product.SpecialPriceDecimal,
            'description': description,
            'capacity': product.Quantity,
            'unit': product.UnitType,
            'package_items_count': product.Quantity,
            'market_id': marketId,
            'category_id': categoryId,
            'featured': '1',
            'deliverable': '1',
            'price_higher': '1',
            ...images
        }
    };

    return new Promise(function (resolve, reject) {
        request(options, function (error, response) {
            if (error) {
                reject(error);
                throw new Error(error);
            } else {
                let body = JSON.parse(response.body);
                if(body.success) {
                    console.log(`IMPORT PRODUCT PASS ${body.data.name}`);
                    resolve(response.body)
                } else {
                    console.log('FAILED TO IMPORT')
                    reject(response);
                    throw new Error(response);
                }
            }
        });
    })
}

async function runImport() {
    const superMarket = 'Tesco'
    try {
        let dirPath = path.resolve(__dirname, `../Categories/${superMarket}`);
        let folders = await fs.promises.readdir(dirPath);

        // Loop them all with the new for...of
        for (let folderCategory of folders) {

            currentDir = path.resolve(__dirname, `${dirPath}/${folderCategory}`);
            // Stat the file to see if we have a file or dir
            const stat = await fs.promises.stat( currentDir );
            
            // BuyMie
            let suFolders = await fs.promises.readdir(currentDir);

            let category;
            let categoryId;

            if(folderCategory === 'Pets') {
                categoryId = 206;
            } else {
                category = await createCategory(folderCategory);
                categoryId = category.data.id;
            }

            for (const subFolder of suFolders) {
                let filesPath = path.resolve(__dirname, `${currentDir}/${subFolder}`);
                let files = await fs.promises.readdir(filesPath);

                for (const file of files) {
                    const dirFile = path.resolve(__dirname, `${filesPath}/${file}`);
                    let rawProductDs = fs.readFileSync(dirFile);
                    let productData = JSON.parse(rawProductDs);
                    let storeName = productData.store.StoreName;
                    productData = productData.store.CategoryProductsAndSubCategories[0];
                    const products = productData.Products;
                    for (const product of products) {
                        await importProduct(categoryId, getStoreId(storeName), product);
                    }
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
    generateImageId
}