const jsonp = (url, options, callback) => {
	let timeout = options.timeout !== null ? options.timeout : 60000;
	let params = options.params || 'callback';
	let timer = null;
	let script;
	let target = document.getElementsByTagName('script')[0] || document.head;
	let name = (options.prefix || '__jp') + new Date().getTime();

	// 清除script标签、注册的全局函数、超时定时器
	const cleanup = () => {
		if (script.parentNode) {
			script.parentNode.removeChild(script);
		}
		window[name] = null;
		if (timer) {
			clearTimeout(timer);
		}
	};

	const cancel = () => {
		if (window[name]) cleanup();
	};

	// 拼接服务端需要的参数
	const format = (data = {}) => {
		if (!data || Object.keys(data).length === 0) return '';
		let str = '';
		for (const key in data) {
			str = str + `${key}=${data[key]}&`;
		}
		return str;
	};

	// 超时
	if (timeout) {
		timer = setTimeout(() => {
			cleanup();
			if (callback) callback(new Error('jsonp timeout'));
		}, timeout);
	}

	window[name] = (data) => {
		cleanup();
		if (callback) callback(null, data);
	};

	// 拼接URL
	url = url + (url.indexOf('?') > 0 ? '&' : '?') + `${format(options.data)}${params}=${name}`;
	url = url.replace('?&', '?');

	// 创建script并加到DOM
	script = document.createElement('script');
	script.src = url;
	target.parentNode?.insertBefore(script, target);

	return cancel;
};
