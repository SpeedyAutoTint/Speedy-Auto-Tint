/*
==========================================================
 Speedy Auto Tint
 Pricing Database
 Version 1.0
==========================================================
*/

const Pricing = {

    company: {
        name: "Speedy Auto Tint",
        version: "1.0",
        currency: "USD",
        phone: "",
        website: ""
    },

    tint: {

        individual: [

            {
                id: "sunstrip",
                service: "Windshield Sun Strip",
                price: 40
            },

            {
                id: "windshield",
                service: "Full Windshield",
                price: 100
            },

            {
                id: "singlewindow",
                service: "Single Window",
                price: 50
            },

            {
                id: "frontpair",
                service: "Two Front Windows",
                price: 100
            },

            {
                id: "sunroof",
                service: "Sunroof",
                price: "50-75"
            }

        ],

        complete: [

            {
                shade: "35%",
                description: "Legal",
                minimum: 160,
                maximum: 180,
                popular: false
            },

            {
                shade: "20%",
                description: "Most Popular",
                minimum: 180,
                maximum: 240,
                popular: true
            },

            {
                shade: "5%",
                description: "Limo",
                minimum: 280,
                maximum: 280,
                popular: false
            }

        ]

    },

    removal: [

        {
            service: "Single Window",
            price: 40
        },

        {
            service: "Complete Vehicle",
            price: 160
        },

        {
            service: "Front Windshield",
            price: null,
            note: "Custom Quote"
        }

    ],

    wraps: {

        smallPanels: [

            {
                service: "Hood",
                price: 250
            },

            {
                service: "Roof",
                price: 250
            },

            {
                service: "Trunk",
                price: 200
            },

            {
                service: "Mirrors",
                price: 80
            },

            {
                service: "Spoiler",
                price: 80
            },

            {
                service: "Chrome Delete",
                price: "150+"
            }

        ],

        partial: [

            {
                service: "Racing Stripes",
                price: 250
            },

            {
                service: "Accent Package",
                price: 350
            },

            {
                service: "Quarter Wrap",
                price: 900
            },

            {
                service: "Half Wrap",
                price: 1300
            }

        ],

        fullVehicle: [

            {
                vehicle: "Coupe",
                price: 2400
            },

            {
                vehicle: "Sedan",
                price: 2600
            },

            {
                vehicle: "Small SUV",
                price: 2900
            },

            {
                vehicle: "Mid Size SUV",
                price: 3200
            },

            {
                vehicle: "Full Size SUV",
                price: 3500
            },

            {
                vehicle: "Pickup Truck",
                price: 3300
            },

            {
                vehicle: "Commercial Van",
                price: 3800
            }

        ],

        fleet: [

            {
                service: "Door Lettering",
                price: 150
            },

            {
                service: "Company Logo",
                price: 200
            },

            {
                service: "Spot Graphics",
                price: 300
            },

            {
                service: "Commercial Wrap",
                price: null,
                note: "Custom Quote"
            }

        ],

        customerMaterial: {

            service: "Bring Your Own Wrap",

            price: "",

            notes: [

                "No warranty on customer supplied material.",

                "Inspect material before scheduling.",

                "Recommend premium cast vinyl.",

                "Additional labor may apply."

            ]

        }

    },

    labor: {

        installTimes: [

            {
                service: "Two Front Windows",
                time: "45-60 Minutes"
            },

            {
                service: "Full Vehicle Tint",
                time: "1.5-2.5 Hours"
            },

            {
                service: "Tint Removal",
                time: "3-4 Hours"
            },

            {
                service: "Hood Wrap",
                time: "2 Hours"
            },

            {
                service: "Roof Wrap",
                time: "2-3 Hours"
            },

            {
                service: "Complete Vehicle Wrap",
                time: "2-5 Days"
            }

        ]

    },

    checklist: [

        "Inspect vehicle for damage",

        "Photograph existing damage",

        "Verify customer phone number",

        "Confirm tint percentage",

        "Explain curing period",

        "Collect deposits for wrap jobs",

        "Verify pickup date",

        "Walk around vehicle before delivery"

    ],

    notes: [

        "Always verify state tint laws.",

        "Match factory privacy glass when requested.",

        "Inspect rear defroster lines before removal.",

        "Book tint removal jobs on sunny days.",

        "Wrap pricing assumes normal body condition.",

        "Heavily damaged paint requires customer acknowledgment.",

        "Ceramic film should be recommended whenever possible."

    ]

};

/*
==========================================================
 Helper Functions
==========================================================
*/

function money(value){

    if(value === null)
        return "Custom Quote";

    if(value === "")
        return "__________";

    if(typeof value === "number")
        return "$" + value.toLocaleString();

    return "$" + value;

}

function priceRange(min,max){

    if(min === max)
        return money(min);

    return "$" + min + " - $" + max;

}

/*
==========================================================
 End of pricing database
==========================================================
*/
