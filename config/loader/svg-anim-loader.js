const fs = require('fs')
const parse = require('svg-parser');

module.exports = function (content) {
    const options = this.getOptions();
    let tempC = '';
    let svgContent = content
    let svgDom = parse.parse(content)
    let tempFileName = this.resourcePath.split("\\")
    tempFileName = (tempFileName.length <= 1) ? tempFileName[0].split("\/") : tempFileName
    tempFileName = tempFileName[tempFileName.length - 1].replace(".svg", "")
    let tempId = svgDom.children[0].properties.id ? svgDom.children[0].properties.id : tempFileName + "_";
    let tempViewBox = null
    if (options.viewBox) {
        options.viewBox = options.viewBox.split("'")[1]
    }

    function parseSvgElem(elem) {
        if (elem.children && elem.children.length - 1 >= 0) {
            elem.children.forEach(function (elemChild) {
                if (elemChild.type == 'element') {
                    if (
                        elemChild.tagName == "linearGradient" ||
                        elemChild.tagName == "radialGradient" ||
                        elemChild.tagName == "clipPath" ||
                        elemChild.tagName == "mask" ||
                        elemChild.tagName == "symbol" ||
                        elemChild.tagName == "filter"
                    ) {
                        let newName = tempId + "_" + elemChild.properties.id;
                        svgContent = svgContent.replace(new RegExp(`"${elemChild.properties.id}"`, "g"), `"${newName}"`)
                        svgContent = svgContent.replace(new RegExp(`="url\\(#${elemChild.properties.id}\\)"`, "g"), `="url(#${newName})"`)
                        svgContent = svgContent.replace(new RegExp(`xlink:href="#${elemChild.properties.id}"`, "g"), `xlink:href="#${newName}"`)
                    }
                    if (elemChild.tagName == "image" && options.outImageUrl) {
                        if (!elemChild.properties['xlink:href'].includes(`data:`)) {
                            let tempArr = elemChild.properties['xlink:href'].split("/")
                            svgContent = svgContent.replace(
                                new RegExp(`xlink:href="${elemChild.properties['xlink:href']}"`, "g"),
                                `xlink:href="${options.outImageUrl + tempArr[tempArr.length - 1]}"`
                            );
                        }
                        else {
                            let newName = tempId + "_" + elemChild.properties.id;
                            svgContent = svgContent.replace(new RegExp(`"${elemChild.properties.id}"`, "g"), `"${newName}"`)
                            svgContent = svgContent.replace(new RegExp(`="url\\(#${elemChild.properties.id}\\)"`, "g"), `="url(#${newName})"`)
                            svgContent = svgContent.replace(new RegExp(`xlink:href="#${elemChild.properties.id}"`, "g"), `xlink:href="#${newName}"`)
                        }
                    }
                    if (elemChild.properties['id']) {
                        let tempId = elemChild.properties['id'];
                        if (tempId && ((tempId[0] == '_' && tempId[1] == 'x' && tempId[2] == '2') || (tempId[0] == '_' && tempId[1] == '-'))) {
                            if (tempId[0] == '_' && tempId[1] == '-') tempId = tempId.slice(3)
                            else tempId = tempId.slice(6)

                            let tempClassList = '';
                            do {
                                if (tempId[0] == '.') {
                                    tempClassList += ' '
                                    tempId = tempId.slice(1)
                                }
                                if (tempId[0] == '-') {
                                    break;
                                }

                                tempClassList += tempId.slice(0, 1)
                                tempId = tempId.slice(1)

                            } while (tempId.length > 0)
                            svgContent = svgContent.replace(
                                new RegExp(`id="${elemChild.properties['id']}"`, "g"),
                                `id="${elemChild.properties['id']}" class="${tempClassList}"`
                            );
                        }
                    }
                    if (elemChild.properties['id'] == options.viewBox) {
                        // if (elemChild.properties['id'] == 'rectViewBox') {
                        tempViewBox = elemChild;
                    }
                }
                parseSvgElem(elemChild)
            })
        }
    }

    if (svgDom.children[0].properties["data-content"] == undefined) {

        parseSvgElem(svgDom)
        let tempPAR = ""
        if (options.par)
            tempPAR = " preserveAspectRatio=" + options.par + " ";
        if (options.class)
            tempPAR += " class=" + options.class + " ";
        if (options.viewBox) {
            const newViewBox = `${tempViewBox.properties.x} ${tempViewBox.properties.y} ${tempViewBox.properties.width} ${tempViewBox.properties.height}`;
            svgContent = svgContent.replace(new RegExp(`width="${svgDom.children[0].properties["width"]}" height="${svgDom.children[0].properties["height"]}" viewBox="${svgDom.children[0].properties["viewBox"]}"`, "g"), `width="${tempViewBox.properties.width}" height="${tempViewBox.properties.height}" viewBox="${newViewBox}"`);
        }

        svgContent = svgContent.replace(/<svg /g, `<svg data-content="changed" ${tempPAR}`)
        if (tempC != svgContent) {
            try {
                fs.writeFileSync(this.resourcePath, svgContent)
                //file written successfully
            } catch (err) {
                console.error(err)
            }
            tempC = svgContent
        }
    }
    svgContent = JSON.stringify(svgContent)
    if (options.needContent == "true") {
        return `module.exports = ${svgContent};`;
    } else {
        return `module.exports = '${svgContent.length + new Date().getSeconds()}'`;
    }
};