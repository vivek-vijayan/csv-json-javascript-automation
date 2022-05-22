
class AutomationScript {
    constructor(dimension, filetype = 'csv'){
        this.dimension = dimension
        this.filetype = filetype
        console.log('Automation activated on the dimension: ' + this.dimension)

    }

    // Function to fetch the master data from the user
    getMasterDataFromUser() {
        console.log('Fetching the master data from the user....')
        
    }
}