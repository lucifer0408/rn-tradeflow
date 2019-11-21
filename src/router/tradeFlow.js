module.exports = {
  demo1: {
    recovery: true,
    tradeflow: {
      subflow: 'public1',
      name: 'public1',
      default: {
        title: 'page1',
        back: false,
        recovery: false,
        name: 'page1',
        default: {
          subflow: 'public2',
          name: 'public2',
          default: {
            title: 'page21',
            name: 'page21',
            default: {
              title: 'page3',
              name: 'page3',
              default: {
                title: 'page5',
                name: 'page5',
              },
            },
          },
        },
        other: {
          title: 'page22',
          name: 'page22',
          back: false,
          default: {
            title: 'page4',
            name: 'page4',
            default: {
              title: 'page5',
              name: 'page5',
              back: false,
            },
          },
        },
      },
    },
  },
  demo2: {
    recovery: true,
    tradeflow: {
      title: 'step1',
      recovery: true,
      default: {
        title: 'step2',
      },
    },
  },
};
