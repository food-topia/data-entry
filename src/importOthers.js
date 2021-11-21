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
                resolve(body);
                console.log(response.body);
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
                    console.log('-----> 1');
                    console.log(`The file is finished downloading.`);
                    resolve(imageDest);
                })
                .on('error', (error) => {
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
                resolve(response.body);
                console.log(response.body);
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
                resolve(response.body)
                console.log(response.body);
            }
        });
    })
}

async function runImport() {
    // let subCategories = getDirectories('../Categories');
    // subCategories.forEach(subCategory => {

    // });
    
    try {
        let dirPath = path.resolve(__dirname, '../Categories/Tesco');
        let folders = await fs.promises.readdir(dirPath);

        // Loop them all with the new for...of
        for (let currentDir of folders) {

            currentDir = path.resolve(__dirname, `${dirPath}/${currentDir}`);
            // Stat the file to see if we have a file or dir
            const stat = await fs.promises.stat( currentDir );
            
            if( stat.isFile() ) {
                let file = currentDir;
                console.log( "'%s' is a file.", currentDir );
                const dirFile = path.resolve(__dirname, `${dirPath}/${currentDir}/${files}`);
                let rawProductDs = fs.readFileSync(dirFile);
                let productData = JSON.parse(rawProductDs);
                let storeName = productData.store.StoreName;
                productData = productData.store.CategoryProductsAndSubCategories[0];
                const products = productData.Products;
                let categoryID = getCategoryId(productData.Name);
                for (const product of products) {
                    await importProduct(categoryID, getStoreId(storeName), product);
                }
            }
            else if( stat.isDirectory() ) {
                // BuyMie
                let suFolders = await fs.promises.readdir(currentDir);
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
                        let category = await createCategory(productData.Name);
                        let categoryId = category.data.id;
                        for (const product of products) {
                            await importProduct(categoryId, getStoreId(storeName), product);
                        }
                    }
                }
                console.log( "'%s' is a directory.", currentDir );
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