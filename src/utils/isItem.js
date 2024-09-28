export const isItem = (name, useSupplemental) => {
    if (typeof useSupplemental === "undefined") {
        console.error("Missing useSupplemental");
        debugger;
        throw new Error("Missing useSupplemental")
    }

    return name[0] === "#" || (useSupplemental && (name[0] === "S"|| name[0] === "P"))
}