const request = require('request');
const fs = require('fs');
const path = require('path');
const STORE_NAME = 'HALAL';
// const STORE_NAME = 'Mr.Price';

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
                    console.log(body);
                    resolve(body);
                } else {
                    console.log('£££ FAILED TO CREATE CATEGORY £££')
                    reject(body);
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
        return 4
    } else if (storeName.toUpperCase() === 'HALAL') {
        return 5
    } else if (storeName.toUpperCase() === 'MR.PRICE') {
        return 6
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
    if(imageName === 'Swaad-1-final.png') {
        imagePath = 'Swaad-1-final-min.png'
        imageName = 'Swaad-1-final-min.png'
    }
    else if(imageName === 'gooseberry.webp') {
        imagePath = 'gooseberry.jpeg'
        imageName = 'gooseberry.jpeg'
    }
    else if(imageName === 'vic0012.webp') {
        imagePath = 'vic0012.jpeg'
        imageName = 'vic0012.jpeg'
    }
    else if(imageName === 'resize.webp') {
        imagePath = 'resize.jpeg'
        imageName = 'resize.jpeg'
    }
    else if(imageName === 'Cycle-Lia-Chandanam.jpg') {
        imagePath = 'Cycle-Lia-Chandanam-working.jpeg'
        imageName = 'Cycle-Lia-Chandanam-working.jpeg'
    }
    else if(imageName === 'Cycle-Lia-Jas.jpg') {
        imagePath = 'Cycle-Lia-Jas-working.jpg'
        imageName = 'Cycle-Lia-Jas-working.jpg'
    }
    else if(imageName === 'Cycle-Lia-Prime-Rose.jpg') {
        imagePath = 'Cycle-Lia-Prime-Rose-working.jpeg'
        imageName = 'Cycle-Lia-Prime-Rose-working.jpeg'
    }
    else if(imageName === 'Haldirams-PaniPuri-360g.jpg') {
        imagePath = 'Haldirams-PaniPuri-360g-working.jpg'
        imageName = 'Haldirams-PaniPuri-360g-working.jpg'
    }
    else if(imageName === 'Tilda-Golden-Sella-5kg.jpg') {
        imagePath = 'Tilda-Golden-Sella-5kg-working.jpeg'
        imageName = 'Tilda-Golden-Sella-5kg-working.jpeg'
    }
    else if(imageName === 'TILDA-GRAND-EXTRALONG-BASMATI-5KG.jpg') {
        imagePath = 'TILDA-GRAND-EXTRALONG-BASMATI-5KG-working.jpg'
        imageName = 'TILDA-GRAND-EXTRALONG-BASMATI-5KG-working.jpg'
    }
    else if(imageName === 'Photo-02-05-2020-13-06-13.png') {
        imagePath = 'bombay-biryani-masala-min.png'
        imageName = 'bombay-biryani-masala-min.png'
    }
    else if(imageName === 'chings-secret-green-chilli-sauce.jpg') {
        imagePath = 'green-chilli-sauce.jpeg'
        imageName = 'green-chilli-sauce.jpeg'
    }
    else if(imageName === 'chupa-chups-grape-sparkling-330ml_1024x.jpg') {
        imagePath = 'chupa-chups-grape-sparkling-330ml.jpeg'
        imageName = 'chupa-chups-grape-sparkling-330ml.jpeg'
    }
    else if(imageName === 'chings-secret-red-chilli-sauce.jpg') {
        imagePath = 'chings-secret-red-chilli-sauce-working.jpeg'
        imageName = 'chings-secret-red-chilli-sauce-working.jpeg'
    }
    else if(imageName === 'Wai-Wai-Chicken-Noodles-70-G.png') {
        imagePath = 'Wai-Wai-Chicken-Noodles-70-G.jpg'
        imageName = 'Wai-Wai-Chicken-Noodles-70-G.jpg'
    }
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
                    console.log('FAILED TO IMPORt')
                    reject(body);
                    throw new Error(error);
                }
                console.log(body);
            }
        });
    })
}

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
}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

const roundPriceAndExtraCharge = (price, extraCharge) => {
    var newnumber = Math.round((price + extraCharge) * 1e12) / 1e12
    return parseFloat(newnumber); 
}
  
const importProduct = async (categoryId, marketId, product) => {
    let resImageimport = await importImages(product.image);

    if (resImageimport === 'failed') {
        throw new Error(`Image Import error!`);
    }

    let description = product.Description ? `<p>${product.Description}</p>` : '';
    let images = json = resImageimport.reduce((json, value, key) => {
        json[`image[${key}]`] = value;
        return json;
    }, {});
    let price = Number(product.price.replace('€', ''));
    let extraCharge = round(price * 0.1, 1)
    price = roundPriceAndExtraCharge(price, extraCharge);

    let options = {
        'method': 'POST',
        'url': 'http://localhost:8888/FT%20Backend/public/api/products/store',
        'headers': {},
        form: {
            'name': product.name,
            'price': price,
            'description': description,
            // 'capacity': product.Quantity,
            // 'discount_price': product.SpecialPriceDecimal,
            // 'unit': product.UnitType,
            // 'package_items_count': product.Quantity,
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
                    resolve(response.body)
                } else {
                    console.log('FAILED TO IMPORt')
                    reject(body);
                    throw new Error(error);
                }
                console.log(body);
            }
        });
    })
}

async function runImport() {
    // let subCategories = getDirectories('../Categories');
    // subCategories.forEach(subCategory => {

    // });

    try {
        let dirPath = path.resolve(__dirname, `../Categories/${STORE_NAME}`);
        let folders = await fs.promises.readdir(dirPath);

        // Loop them all with the new for...of
        for (let file of folders) {
            const dirFile = path.resolve(__dirname, `${dirPath}/${file}`);
            let rawProductDs = fs.readFileSync(dirFile);
            let productData = JSON.parse(rawProductDs);
            const categoryName = file.replace(/\.[^/.]+$/, "");
            let category = await createCategory(categoryName);
            let categoryId = category.data.id;
            let storeName = STORE_NAME;
            for (const product of productData) {
                await importProduct(categoryId, getStoreId(storeName), product);
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