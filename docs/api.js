YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Dir",
        "dir-read",
        "helpers"
    ],
    "modules": [
        "Dir",
        "JsonDir",
        "json-dir"
    ],
    "allModules": [
        {
            "displayName": "Dir",
            "name": "Dir",
            "description": "Dir is the directory object representation.\nThe constructor basically stores the path to the dir\nand creates a files hash, on which file objects will be stored."
        },
        {
            "displayName": "json-dir",
            "name": "json-dir"
        },
        {
            "displayName": "JsonDir",
            "name": "JsonDir",
            "description": "CJS module."
        }
    ]
} };
});