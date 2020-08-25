const statement = (invoice, availableServices) => {
    let totalAmount = 0;
    let totalCreditPoints = 0;
    let statement = `Statement for ${invoice.customer.name}\n`;
    const format = new Intl.NumberFormat("en-IN", {
        style: 'currency', currency: 'INR', minimumFractionDigits: 2
    }).format;

    for (let service of invoice.services) {
        const { name, type } = availableServices[service.serviceId];
        let thisAmount = 0;

        switch (type) {
            case 'hatchback':
                thisAmount = 2400;
                if (service.hrs > 24) {
                    thisAmount += 80 * (service.hrs - 24);
                }
                break;

            case 'sedan':
                thisAmount = 2400;

                if (service.hrs > 18) {
                    thisAmount += 200 + 120 * (service.hrs - 18);
                }

                break;

            default:
                throw new Error('Invalid service')
        }

        totalAmount += thisAmount;

        statement += `\t${name}: ${format(thisAmount)} (${service.hrs} hrs)\n`;

        totalCreditPoints += 10 * service.hrs;

        if(type === 'sedan') {
            totalCreditPoints += 20 * Math.floor(service.hrs / 24);
        }
    }

    statement += `Amount owed is ${format(totalAmount)}\n`;
    statement += `You earned ${totalCreditPoints} credit points\n`;

    return statement
};

// usage
const invoice = {
    customer: {
        name: 'BigCo',
    },
    services: [{
        serviceId: 'grandI10',
        hrs: 36,
    }, {
        serviceId: 'amaze',
        hrs: 36,
    },
    ]
};

const availableServices = {
    grandI10: {
        name: 'Maruti Grand i10',
        type: 'hatchback'
    },
    amaze: {
        name: 'Honda Amaze',
        type: 'sedan'
    }
};


const billStatement = statement(invoice, availableServices);

// output
console.log(billStatement);
