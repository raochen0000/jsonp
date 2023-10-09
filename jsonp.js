const jsonp = (url, options, callback) => {
	let timeout = options.timeout !== null ? options.timeout : 60000;
	let params = options.params || 'callback';
	let timer = null;
	let script;
	let target = document.getElementsByTagName('script')[0] || document.head;
	let prefix = options.prefix || '__jp';
	let id = options.name || prefix + new Date().getTime();

	// 清除script标签、注册的全局函数、超时定时器
	const cleanup = () => {
		if (script.parentNode) {
			script.parentNode.removeChild(script);
		}
		window[id] = null;
		if (timer) {
			clearTimeout(timer);
		}
	};

	const cancel = () => {
		if (window[id]) cleanup();
	};

	// 超时
	if (timeout) {
		timer = setTimeout(() => {
			cleanup();
			if (callback) callback(new Error('jsonp timeout'));
		}, timeout);
	}

	window[id] = (data) => {
		cleanup();
		if (callback) callback(null, data);
	};

	// 拼接URL
	url = url + (url.indexOf('?') > 0 ? '&' : '?') + params + '=' + encodeURIComponent(id);
	url = url.replace('?&', '?');

	// 创建script并加到DOM
	script = document.createElement('script');
	script.src = url;
	target.parentNode?.insertBefore(script, target);

	return cancel;
};
